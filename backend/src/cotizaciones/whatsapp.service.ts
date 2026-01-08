import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

type WhatsappPayload = {
  to: string;
  message: string;
  quoteId?: number;
  status?: string;
  attachmentUrls?: string[];
};

@Injectable()
export class WhatsappService {
  private readonly apiUrl = process.env.WHATSAPP_API_URL;
  private readonly token = process.env.WHATSAPP_API_TOKEN;
  private readonly from = process.env.WHATSAPP_FROM;
  private readonly logger = new Logger(WhatsappService.name);
  private readonly enabled: boolean;

  constructor() {
    this.enabled = !!(this.apiUrl && this.token && this.from);
    if (!this.enabled) {
      this.logger.warn(
        'WhatsAppService deshabilitado: falta WHATSAPP_API_URL/WHATSAPP_API_TOKEN/WHATSAPP_FROM',
      );
    }
  }

  async sendUpdate(payload: WhatsappPayload) {
    if (!payload?.to) {
      this.logger.warn('WhatsApp: sin destinatario, se omite envío');
      return { delivered: false, reason: 'missing_recipient' };
    }

    if (!this.enabled) {
      this.logger.log(
        `WhatsApp STUB -> ${payload.to}: ${payload.message} (${payload.status ?? 'sin estado'})`,
      );
      return { delivered: false, reason: 'disabled' };
    }

    try {
      await axios.post(
        this.apiUrl!,
        {
          from: this.from,
          to: payload.to,
          message: payload.message,
          attachments: payload.attachmentUrls ?? [],
          metadata: {
            quoteId: payload.quoteId,
            status: payload.status,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          timeout: 8_000,
        },
      );
      this.logger.log(`WhatsApp enviado a ${payload.to}`);
      return { delivered: true };
    } catch (err: any) {
      this.logger.error(
        `Error enviando WhatsApp a ${payload.to}: ${err?.message ?? err}`,
      );
      return { delivered: false, reason: 'error' };
    }
  }
}
