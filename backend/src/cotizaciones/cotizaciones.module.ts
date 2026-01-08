import { Module } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './cotizacion.entity';
import { Product } from '../productos/product.entity';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { WhatsappService } from './whatsapp.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion, Product]),
    AuthModule,
    MailModule,
    RealtimeModule,
  ],
  providers: [CotizacionesService, WhatsappService],
  controllers: [CotizacionesController],
})
export class CotizacionesModule {}
