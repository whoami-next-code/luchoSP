import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminGateway } from './admin.gateway';
import { PublicGateway } from './public.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'supersecret_industriassp',
      }),
    }),
  ],
  providers: [AdminGateway, PublicGateway, EventsService],
  exports: [EventsService, PublicGateway],
})
export class RealtimeModule {}
