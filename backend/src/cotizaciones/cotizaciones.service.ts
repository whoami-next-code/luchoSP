import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Cotizacion, ProgressUpdate } from './cotizacion.entity';
import { Product } from '../productos/product.entity';
import { EventsService } from '../realtime/events.service';

type QuoteFilters = {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  customerEmail?: string;
  technician?: string;
};

type Pagination = {
  page?: number;
  limit?: number;
};

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly repo: Repository<Cotizacion>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly events: EventsService,
  ) {}

  private generateCode() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `COT-${yyyy}${mm}${dd}-${rand}`;
  }

  private statusToProgress(status?: string) {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'PENDIENTE':
      case 'NUEVA':
        return 5;
      case 'APROBADA':
      case 'EN_PROCESO':
        return 20;
      case 'PRODUCCION':
      case 'EN_PRODUCCION':
        return 55;
      case 'INSTALACION':
        return 85;
      case 'FINALIZADA':
      case 'COMPLETADA':
      case 'ENTREGADA':
        return 100;
      default:
        return 10;
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<Cotizacion>,
    filters: QuoteFilters = {},
  ) {
    if (filters.status) {
      qb.andWhere('LOWER(q.status) = LOWER(:status)', {
        status: filters.status,
      });
    }
    if (filters.customerEmail) {
      qb.andWhere('LOWER(q.customerEmail) = LOWER(:customerEmail)', {
        customerEmail: filters.customerEmail,
      });
    }
    if (filters.search) {
      const search = `%${filters.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(q.customerName) LIKE :search OR LOWER(q.customerEmail) LIKE :search OR LOWER(q.code) LIKE :search)',
        { search },
      );
    }
    if (filters.from) {
      qb.andWhere('q.createdAt >= :from', { from: filters.from });
    }
    if (filters.to) {
      qb.andWhere('q.createdAt <= :to', { to: filters.to });
    }
    if (filters.technician) {
      qb.andWhere(
        '(LOWER(q.technicianName) LIKE :tech OR LOWER(q.installationTechnician) LIKE :tech)',
        { tech: `%${filters.technician.toLowerCase()}%` },
      );
    }
    return qb;
  }

  private async getStatusSummary(filters: QuoteFilters = {}) {
    const qb = this.repo.createQueryBuilder('q');
    this.applyFilters(qb, filters);
    qb.select('q.status', 'status').addSelect('COUNT(*)', 'count');
    qb.groupBy('q.status');
    const raw = await qb.getRawMany<{ status: string; count: string }>();
    const byStatus = raw.reduce<Record<string, number>>((acc, row) => {
      const key = (row.status || 'DESCONOCIDO').toUpperCase();
      acc[key] = Number(row.count) || 0;
      return acc;
    }, {});
    return { byStatus };
  }

  create(data: Partial<Cotizacion>) {
    const status = data.status ?? 'PENDIENTE';
    const entity = this.repo.create({
      status,
      code: data.code ?? this.generateCode(),
      progressUpdates: [],
      totalAmount:
        data.totalAmount ??
        (data.budget ? Number(data.budget) || undefined : undefined),
      estimatedDeliveryDate: data.estimatedDeliveryDate ?? data.estimatedDate,
      progressPercent:
        typeof data.progressPercent === 'number'
          ? Math.max(0, Math.min(100, data.progressPercent))
          : this.statusToProgress(status),
      ...data,
    });
    return this.validateBusinessRules(entity).then(async () => {
      const saved = await this.repo.save(entity);
      this.events.cotizacionesUpdated(saved);
      return saved;
    });
  }

  async findAll(filters: QuoteFilters = {}, pagination?: Pagination) {
    const qb = this.repo.createQueryBuilder('q');
    this.applyFilters(qb, filters);
    qb.orderBy('q.createdAt', 'DESC');

    const usePagination =
      pagination !== undefined &&
      (Number.isFinite(pagination.page) || Number.isFinite(pagination.limit));

    if (usePagination) {
      const page = Math.max(1, Number(pagination?.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(pagination?.limit) || 20));

      qb.take(limit).skip((page - 1) * limit);
      const [data, total] = await qb.getManyAndCount();
      const summary = await this.getStatusSummary(filters);
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        data,
        total,
        page,
        pageSize: limit,
        totalPages,
        stats: { ...summary, total },
      };
    }

    return qb.getMany();
  }

  findByEmail(email: string, filters: QuoteFilters = {}) {
    return this.findAll({ ...filters, customerEmail: email });
  }

  async findOne(id: number) {
    const found = await this.repo.findOneBy({ id });
    if (!found) return null;
    // Normalizar valores derivados
    if (!found.code) {
      found.code = this.generateCode();
    }
    if (typeof found.progressPercent !== 'number') {
      found.progressPercent = this.statusToProgress(found.status);
    }
    return found;
  }

  async update(id: number, data: Partial<Cotizacion>) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Cotización no encontrada');
    const status = data.status ?? found.status;
    Object.assign(found, {
      ...data,
      estimatedDeliveryDate:
        data.estimatedDeliveryDate ??
        data.estimatedDate ??
        found.estimatedDeliveryDate,
      status,
    });
    const nextPercent =
      typeof data.progressPercent === 'number'
        ? data.progressPercent
        : this.statusToProgress(status);
    found.progressPercent = Math.max(0, Math.min(100, nextPercent));
    await this.validateBusinessRules(found);
    const saved = await this.repo.save(found);
    this.events.cotizacionesUpdated(saved);
    return saved;
  }

  async addProgress(
    id: number,
    progress: Omit<ProgressUpdate, 'createdAt'>,
    extra?: Partial<Cotizacion>,
  ) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Cotización no encontrada');

    const history = Array.isArray(found.progressUpdates)
      ? found.progressUpdates
      : [];
    const entry: ProgressUpdate = {
      createdAt: new Date().toISOString(),
      ...progress,
    };
    history.unshift(entry);
    found.progressUpdates = history;
    if (progress.status) {
      found.status = progress.status;
    }
    if (progress.progressPercent !== undefined) {
      const pct = Number(progress.progressPercent);
      if (Number.isFinite(pct)) {
        found.progressPercent = Math.max(0, Math.min(100, pct));
      }
    } else if (progress.status) {
      found.progressPercent = this.statusToProgress(progress.status);
    }
    if (progress.estimatedDate) {
      found.estimatedDate = progress.estimatedDate;
      found.estimatedDeliveryDate = progress.estimatedDate;
    }
    if (extra) {
      Object.assign(found, extra);
    }
    found.lastUpdateMessage = progress.message ?? found.lastUpdateMessage;
    await this.validateBusinessRules(found);
    const saved = await this.repo.save(found);
    this.events.cotizacionesUpdated(saved);
    return saved;
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Cotización no encontrada');
    return { deleted: true };
  }

  private assertNotPastDate(date?: string | null, fieldName = 'fecha') {
    if (!date) return;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);
    if (parsed < today) {
      throw new BadRequestException(
        `La ${fieldName} no puede ser una fecha pasada`,
      );
    }
  }

  private async validateBudget(data: Partial<Cotizacion>) {
    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) return;
    const ids = items
      .map((it) => it.productId)
      .filter((v): v is number => typeof v === 'number');
    if (!ids.length) return;
    const products = await this.productRepo.findBy({ id: In(ids) });
    if (!products.length) return;
    const priceMap = new Map(products.map((p) => [p.id, Number(p.price) || 0]));
    const baseTotal = items.reduce((acc, it) => {
      const price = priceMap.get(it.productId!) ?? 0;
      const qty = Number(it.quantity) || 1;
      return acc + price * qty;
    }, 0);
    const budgetNumber =
      typeof data.totalAmount === 'number'
        ? data.totalAmount
        : Number(data.budget);
    if (baseTotal > 0 && Number.isFinite(budgetNumber)) {
      if (budgetNumber < baseTotal) {
        throw new BadRequestException(
          'El presupuesto no puede ser menor al precio del producto seleccionado',
        );
      }
    }
  }

  private async validateBusinessRules(data: Partial<Cotizacion>) {
    this.assertNotPastDate(
      data.estimatedDeliveryDate ?? data.estimatedDate,
      'fecha de entrega',
    );
    await this.validateBudget(data);
  }

  async buildReport(id: number) {
    const found = await this.findOne(id);
    if (!found) throw new NotFoundException('Cotización no encontrada');
    const timeline = Array.isArray(found.progressUpdates)
      ? found.progressUpdates
      : [];
    const lastUpdate = timeline[0];
    return {
      ...found,
      timeline,
      lastUpdate,
      summary: {
        status: found.status,
        progressPercent: found.progressPercent,
        estimatedDeliveryDate:
          found.estimatedDeliveryDate ?? found.estimatedDate ?? null,
        totalAmount: found.totalAmount ?? found.budget ?? null,
      },
    };
  }
}
