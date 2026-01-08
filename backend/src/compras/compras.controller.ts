import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { CrearCompraMultipleDto } from './dto/crear-compra-multiple.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/compras')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'VENDEDOR')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async crearCompra(@Body() dto: CrearCompraDto) {
    return this.comprasService.crearCompra(dto);
  }

  @Post('multiples')
  async crearCompraMultiple(@Body() dto: CrearCompraMultipleDto) {
    return this.comprasService.crearCompraMultiple(dto);
  }
}
