import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { PedidosService } from './pedidos.service';

@ApiTags('trabajos')
@Controller('api/trabajos')
@UseGuards(SupabaseAuthGuard)
export class TrabajosController {
  constructor(private readonly pedidos: PedidosService) {}

  @Get('asignados')
  asignados(@Req() req: any) {
    const userId = req.user?.userId;
    // Si no hay usuario autenticado, devolver lista vacía (solo para desarrollo)
    if (!userId) {
      return [];
    }
    return this.pedidos.findByUserId(Number(userId));
  }
}
