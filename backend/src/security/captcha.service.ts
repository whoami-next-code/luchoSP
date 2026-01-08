import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { URLSearchParams } from 'url';

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger('CaptchaService');
  private readonly verifyUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  private readonly secret = process.env.TURNSTILE_SECRET_KEY || '';

  async verify(token: string, ip?: string) {
    if (!this.secret) {
      this.logger.warn(
        'TURNSTILE_SECRET_KEY no configurado. Se omite verificación en desarrollo.',
      );
      return process.env.NODE_ENV !== 'production';
    }
    try {
      const params = new URLSearchParams();
      params.append('secret', this.secret);
      params.append('response', token);
      if (ip) params.append('remoteip', ip);
      const { data } = await axios.post(this.verifyUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 2000,
      });
      return !!data?.success;
    } catch (e: any) {
      this.logger.warn(`Error verificando captcha: ${e?.message || String(e)}`);
      return false;
    }
  }
}
