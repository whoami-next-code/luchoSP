import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type {
  CrearContactoDto,
  ActualizarEstadoDto,
} from './contactos.service';

@Controller('api/contactos')
export class ContactosController {
  constructor(private readonly service: ContactosService) {}

  @Post()
  crear(@Body() body: CrearContactoDto) {
    return this.service.crear(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.service.listar();
  }

  @Put(':id/estado')
  @UseGuards(JwtAuthGuard)
  actualizarEstado(@Param('id') id: string, @Body() body: ActualizarEstadoDto) {
    return this.service.actualizarEstado(Number(id), body);
  }
}
