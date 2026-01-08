import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Helmet con políticas más permisivas para archivos estáticos
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: [
            "'self'",
            'data:',
            'http://localhost:3000',
            'http://localhost:3002',
          ],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  const corsOriginsEnv = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return cb(null, true);

      if (corsOriginsEnv.includes(origin)) return cb(null, true);

      try {
        const url = new URL(origin);
        const isLocalhost =
          url.hostname === 'localhost' ||
          url.hostname === '127.0.0.1' ||
          url.hostname === '10.0.2.2';

        if (isLocalhost) {
          return cb(null, true);
        }
      } catch {}

      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'x-external-secret',
      'stripe-signature',
    ],
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });
  // Webhook de Stripe necesita el body RAW para verificar firmas
  app.use('/api/pagos/webhook', express.raw({ type: 'application/json' }));
  
  // Servir archivos estáticos desde public/uploads
  app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')));
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3001);
}
bootstrap();
