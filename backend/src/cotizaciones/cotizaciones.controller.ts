import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { MailService } from '../mail/mail.service';
import { WhatsappService } from './whatsapp.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { EventsService } from '../realtime/events.service';

@Controller('api/cotizaciones')
export class CotizacionesController {
  constructor(
    private readonly service: CotizacionesService,
    private readonly mail: MailService,
    private readonly whatsapp: WhatsappService,
    private readonly events: EventsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  async create(@Req() req: any, @Body() body: CreateCotizacionDto) {
    // Seguridad: forzar que la cotización se asocie al usuario autenticado
    const email = req.user?.email;
    if (!email) throw new BadRequestException('Usuario no válido');
    const safeBody = {
      ...body,
      customerEmail: email,
      status: 'PENDIENTE',
      need: body?.need ?? body?.descripcion ?? undefined,
      estimatedDate:
        body?.estimatedDate ??
        body?.delivery ??
        body?.estimatedDeliveryDate ??
        undefined,
      estimatedDeliveryDate:
        body?.estimatedDeliveryDate ??
        body?.estimatedDate ??
        body?.delivery ??
        undefined,
      budget:
        body?.budget !== undefined || body?.montoTotal !== undefined
          ? String(body?.budget ?? body?.montoTotal ?? '')
          : undefined,
      totalAmount:
        body?.montoTotal ??
        body?.totalAmount ??
        (typeof body?.budget === 'number' ? body.budget : undefined),
      preferredChannel: body?.preferredChannel ?? 'WHATSAPP',
      customerCompany: body?.company ?? body?.customerCompany ?? undefined,
      customerDocument: body?.customerDocument ?? body?.documento ?? undefined,
      customerAddress: body?.customerAddress ?? body?.direccion ?? undefined,
      technicianName: body?.technicianName ?? undefined,
      technicianPhone: body?.technicianPhone ?? undefined,
      technicianEmail: body?.technicianEmail ?? undefined,
      installationTechnician: body?.installationTechnician ?? undefined,
      items: Array.isArray(body.items) ? body.items : [],
      progressUpdates: [],
    };
    const created = await this.service.create(safeBody);

    // Notificar por correo al equipo de ventas/soporte
    const notifyTo =
      process.env.QUOTES_NOTIFY_EMAIL ||
      process.env.ADMIN_ALERT_EMAIL ||
      process.env.SUPPORT_EMAIL;
    if (notifyTo) {
      try {
        const attachmentList =
          (created.attachmentUrls || [])
            .map((u) => `<li><a href="${u}">${u}</a></li>`)
            .join('') || '<li>Sin adjuntos</li>';
        const itemsList =
          (created.items || [])
            .map((it) => `<li>Producto #${it.productId} x ${it.quantity}</li>`)
            .join('') || '<li>Sin items</li>';

        await this.mail.sendQuoteNotification({
          to: notifyTo,
          customerName: created.customerName,
          customerEmail: created.customerEmail,
          productName: created.productName,
          status: created.status,
          notes: created.notes,
          attachmentHtml: `<ul>${attachmentList}</ul>`,
          itemsHtml: `<ul>${itemsList}</ul>`,
        });
      } catch (mailErr: any) {
        // No fallar la creación si falla el correo
      }
    }

    this.events.cotizacionesUpdated({ id: created.id, action: 'create' });
    return created;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  findAll(
    @Query('status') status?: string,
    @Query('q') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('email') email?: string,
    @Query('technician') technician?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    return this.service.findAll({
      status: status || undefined,
      search: search || undefined,
      from: from || undefined,
      to: to || undefined,
      customerEmail: email || undefined,
      technician: technician || undefined,
    }, {
      page: Number.isFinite(parsedPage) ? parsedPage : undefined,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    });
  }

  @Get('mias')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: any) {
    // #region agent log
    const fs = require('fs');
    const logPath =
      'c:\\Users\\USUARIO\\Desktop\\insdustriaSP\\.cursor\\debug.log';
    try {
      fs.appendFileSync(
        logPath,
        JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'H1',
          location: 'cotizaciones.controller.ts:findMine',
          message: 'findMine endpoint called',
          data: {
            hasUser: !!req.user,
            userEmail: req.user?.email,
            userId: req.user?.userId,
          },
          timestamp: Date.now(),
        }) + '\n',
      );
    } catch {}
    // #endregion
    const email = req.user?.email;
    if (!email) throw new BadRequestException('Usuario no válido');
    const result = this.service.findByEmail(email);
    // #region agent log
    try {
      fs.appendFileSync(
        logPath,
        JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'H1',
          location: 'cotizaciones.controller.ts:findMine',
          message: 'findMine result',
          data: {
            email,
            resultCount: Array.isArray(result) ? result.length : 'not-array',
          },
          timestamp: Date.now(),
        }) + '\n',
      );
    } catch {}
    // #endregion
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Get(':id/reporte')
  @UseGuards(JwtAuthGuard)
  async report(@Param('id') id: string) {
    return this.service.buildReport(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  async update(@Param('id') id: string, @Body() body: any) {
    const updated = await this.service.update(Number(id), body);
    this.events.cotizacionesUpdated({ id: Number(id), action: 'update' });
    return updated;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const res = await this.service.remove(Number(id));
    this.events.cotizacionesUpdated({ id: Number(id), action: 'delete' });
    return res;
  }

  @Post('adjuntos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: (_req, _file, cb) =>
          cb(null, join(process.cwd(), 'public', 'uploads', 'cotizaciones')),
        filename: (_req, file, cb) =>
          cb(
            null,
            `${Date.now()}-${Math.random().toString(16).slice(2)}-${file.originalname.replace(
              /\s+/g,
              '_',
            )}`,
          ),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      process.env.WEB_URL ||
      'http://localhost:3001';
    const urls = (files || []).map(
      (f) => `${baseUrl}/uploads/cotizaciones/${f.filename}`,
    );
    return { ok: true, urls };
  }

  @Post(':id/avances')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  async addProgress(@Param('id') id: string, @Body() body: any) {
    if (!body?.message) {
      throw new BadRequestException('El mensaje es requerido');
    }

    const updated = await this.service.addProgress(
      Number(id),
      {
        message: body.message,
        status: body.status ?? undefined,
        estimatedDate: body.estimatedDate ?? undefined,
        attachmentUrls: body.attachmentUrls ?? [],
        materials: body.materials ?? undefined,
        author: body.author ?? 'Sistema',
        channel: body.channel ?? 'WHATSAPP',
        progressPercent:
          typeof body.progressPercent === 'number'
            ? body.progressPercent
            : undefined,
        technician: body.technician ?? undefined,
      },
      {
        technicianName: body.technicianName ?? undefined,
        technicianPhone: body.technicianPhone ?? undefined,
        technicianEmail: body.technicianEmail ?? undefined,
        installationTechnician:
          body.installationTechnician ?? body.technicianName ?? undefined,
        clientMessage: body.clientMessage ?? undefined,
      },
    );

    // Intentar notificar por WhatsApp si hay teléfono
    try {
      if (updated.customerPhone) {
        await this.whatsapp.sendUpdate({
          to: updated.customerPhone,
          message: body.message,
          quoteId: updated.id,
          status: body.status,
          attachmentUrls: body.attachmentUrls,
        });
      }
    } catch (err) {
      // No interrumpir el flujo por fallas de notificación
      console.error('Error notificando por WhatsApp', err?.message || err);
    }

    this.events.cotizacionesUpdated({ id: Number(id), action: 'update' });
    return updated;
  }
}
