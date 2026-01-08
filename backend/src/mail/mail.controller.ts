import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('api/mail')
export class MailController {
  constructor(
    private readonly mail: MailService,
    private readonly users: UsersService,
  ) {}

  @Get('logs')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async logs() {
    return this.mail.listLogs(50);
  }

  @Get('metrics')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async metrics() {
    return this.mail.metrics();
  }

  // Webhook para eventos de Resend (delivered, opened, clicked, etc.)
  @Post('webhook')
  async webhook(@Req() req: any) {
    try {
      const body = req.body || {};
      const type: string = body?.type || '';
      const messageId: string =
        body?.data?.email?.id || body?.data?.id || body?.email_id || '';
      const timestamp: string | undefined =
        body?.timestamp || body?.data?.timestamp;
      if (messageId && type) {
        await this.mail.updateEvent(messageId, type, timestamp);
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'webhook_error' };
    }
  }

  @Post('test')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async testSend(
    @Body() body: { to: string; subject?: string; html?: string },
  ) {
    const to = body.to;
    const subject = body.subject ?? 'Prueba de correo IndustriaSP';
    const html =
      body.html ??
      '<p>Este es un correo de prueba enviado desde IndustriaSP.</p>';
    return await this.mail.sendTest(to, subject, html);
  }

  @Get('verify-config')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifyConfig() {
    return this.mail.verifyResendConfig();
  }

  @Post('test-multi')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async testMulti(
    @Body() body: { recipients: string[]; subject?: string; html?: string },
  ) {
    const subject = body.subject ?? 'Prueba múltiple IndustriaSP';
    const html =
      body.html ?? '<p>Contenido de prueba múltiple desde IndustriaSP.</p>';
    const results = [];
    for (const to of body.recipients || []) {
      const r = await this.mail.sendTest(to, subject, html);
      results.push({ to, ...r });
    }
    return { ok: true, sent: results.length, results };
  }

  // Enviar campaña/promoción a clientes verificados
  @Post('promo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendPromo(
    @Body()
    body: {
      title: string;
      bodyHtml: string;
      ctaUrl?: string;
      ctaText?: string;
    },
  ) {
    const clients = await this.users.findAll({
      role: UserRole.CLIENTE,
      verified: true,
    });
    const results = [];
    for (const c of clients) {
      if (!c.email) continue;
      const r = await this.mail.sendPromotional({
        to: c.email,
        title: body.title,
        bodyHtml: body.bodyHtml,
        ctaUrl: body.ctaUrl,
        ctaText: body.ctaText,
      });
      results.push({ email: c.email, ...r });
    }
    return { ok: true, sent: results.length, results };
  }
}
