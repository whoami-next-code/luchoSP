import { Injectable, Optional } from '@nestjs/common';
import { AdminGateway } from './admin.gateway';
import { PublicGateway } from './public.gateway';

@Injectable()
export class EventsService {
  constructor(
    private readonly gateway: AdminGateway,
    @Optional() private readonly publicGateway?: PublicGateway,
  ) {}
  emit(event: string, data: any) {
    this.gateway.broadcast(event, data);
    if (this.publicGateway) this.publicGateway.broadcast(event, data);
  }
  productosUpdated(payload: any) {
    this.emit('productos.updated', payload);
  }
  pedidosUpdated(payload: any) {
    this.emit('pedidos.updated', payload);
  }
  cotizacionesUpdated(payload: any) {
    this.emit('cotizaciones.updated', payload);
  }
}
