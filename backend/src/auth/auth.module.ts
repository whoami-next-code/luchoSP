import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailModule } from '../mail/mail.module';
import { AuditModule } from '../audit/audit.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'supersecret_industriassp',
        // usar segundos para cumplir con el tipo de Nest JWT (number)
        signOptions: {
          expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 604800),
        },
      }),
    }),
    MailModule,
    AuditModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 120,
      },
    ]),
  ],
  providers: [AuthService, JwtStrategy, SupabaseAuthGuard, JwtAuthGuard],
  exports: [AuthService, SupabaseAuthGuard, JwtAuthGuard, UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}
