import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Put,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('api/clientes')
export class ClientesMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuario no autenticado');
    const user = await this.usersService.findOne(Number(userId));
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return {
      fullName: user.fullName ?? '',
      document: user.document ?? '',
      email: user.email,
      phone: user.phone ?? '',
      address: user.address ?? '',
    };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req: any, @Body() body: UpdateClientDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuario no autenticado');
    const payload: Partial<UpdateClientDto> = {
      fullName: body.fullName,
      email: body.email?.toLowerCase(),
      document: body.document,
      phone: body.phone,
      address: body.address,
    };
    const updated = await this.usersService.update(Number(userId), payload);
    return {
      fullName: updated.fullName,
      email: updated.email,
      document: updated.document,
      phone: updated.phone,
      address: updated.address,
    };
  }
}
