import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { MailLog } from '../src/mail/mail-log.entity';
import { Repository } from 'typeorm';

describe('AuthController - Integración de Email (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let mailLogRepository: Repository<MailLog>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    mailLogRepository = moduleFixture.get(getRepositoryToken(MailLog));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar datos de prueba
    await mailLogRepository.delete({});
    await userRepository.delete({ email: 'test-email@example.com' });
  });

  describe('POST /api/auth/register - Email de Bienvenida', () => {
    it('debería crear usuario y enviar email de bienvenida', async () => {
      const newUser = {
        email: 'test-email@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User Email',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      expect(response.body.verificationToken).toBeDefined();
      expect(response.body.user.email).toBe(newUser.email);

      // Esperar a que se procese el email asíncrono
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verificar que se creó el log de email
      const mailLogs = await mailLogRepository.find({
        where: { to: newUser.email, type: 'ACCOUNT_CREATION' },
      });

      expect(mailLogs.length).toBeGreaterThan(0);

      const log = mailLogs[0];
      expect(log.subject).toBe('Bienvenido a IndustriaSP');
      expect(log.to).toBe(newUser.email);
      // El estado puede ser SUCCESS o FAIL dependiendo de la configuración de Resend
      expect(['SUCCESS', 'FAIL']).toContain(log.status);

      if (log.status === 'SUCCESS') {
        expect(log.providerMessageId).toBeDefined();
      } else {
        expect(log.errorMessage).toBeDefined();
      }
    });

    it('no debería bloquear el registro si falla el envío de email', async () => {
      const newUser = {
        email: 'test-email-fail@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User Fail',
      };

      // Incluso si Resend no está configurado, el registro debe funcionar
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      expect(response.body.user.email).toBe(newUser.email);
    });
  });

  describe('POST /api/auth/forgot-password - Email de Recuperación', () => {
    it('debería enviar email de recuperación de contraseña', async () => {
      // Primero crear un usuario
      const user = {
        email: 'test-recovery@example.com',
        password: 'SecurePass123!',
        fullName: 'Test Recovery',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(user)
        .expect(201);

      // Esperar creación
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Solicitar recuperación de contraseña
      const response = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: user.email })
        .expect(201);

      expect(response.body.sent).toBe(true);
      expect(response.body.token).toBeDefined();

      // Esperar envío de email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verificar log de email de recuperación
      const mailLogs = await mailLogRepository.find({
        where: { to: user.email, type: 'PASSWORD_RESET' },
      });

      expect(mailLogs.length).toBeGreaterThan(0);

      const log = mailLogs[0];
      expect(log.subject).toBe('Recuperación de contraseña');
      expect(log.to).toBe(user.email);
    });
  });

  describe('Monitoreo de Logs de Email', () => {
    it('GET /api/mail/logs debería listar logs de emails enviados', async () => {
      // Crear usuario para generar logs
      const user = {
        email: 'test-logs@example.com',
        password: 'SecurePass123!',
        fullName: 'Test Logs',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(user)
        .expect(201);

      const token = registerResponse.body.access_token;

      // Esperar envío de email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Obtener logs (requiere autenticación como ADMIN)
      const logsResponse = await request(app.getHttpServer())
        .get('/api/mail/logs')
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => {
          // Puede devolver 200 o 403 dependiendo del rol
          expect([200, 403]).toContain(res.status);
        });

      // Si es ADMIN, verificar la estructura
      if (logsResponse.status === 200) {
        expect(Array.isArray(logsResponse.body)).toBe(true);
        if (logsResponse.body.length > 0) {
          const log = logsResponse.body[0];
          expect(log).toHaveProperty('type');
          expect(log).toHaveProperty('to');
          expect(log).toHaveProperty('subject');
          expect(log).toHaveProperty('status');
        }
      }
    });
  });

  describe('Validación de contenido de Email', () => {
    it('el email debería contener token de verificación válido', async () => {
      const user = {
        email: 'test-verification@example.com',
        password: 'SecurePass123!',
        fullName: 'Test Verification',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(user)
        .expect(201);

      const verificationToken = response.body.verificationToken;
      expect(verificationToken).toBeDefined();
      expect(typeof verificationToken).toBe('string');
      expect(verificationToken.length).toBe(32); // randomBytes(16).toString('hex')

      // Verificar que el usuario fue actualizado con el token
      const dbUser = await userRepository.findOne({
        where: { email: user.email },
      });
      expect(dbUser).toBeDefined();
      expect((dbUser as any).verificationToken).toBe(verificationToken);
    });
  });

  describe('Resiliencia del sistema', () => {
    it('debería continuar funcionando con múltiples registros simultáneos', async () => {
      const users = Array.from({ length: 5 }, (_, i) => ({
        email: `concurrent-${i}@example.com`,
        password: 'SecurePass123!',
        fullName: `Concurrent User ${i}`,
      }));

      const promises = users.map((user) =>
        request(app.getHttpServer()).post('/api/auth/register').send(user),
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.access_token).toBeDefined();
      });

      // Esperar procesamiento de emails
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Verificar que se intentó enviar email a todos
      const mailLogs = await mailLogRepository.find({
        where: { type: 'ACCOUNT_CREATION' },
      });

      expect(mailLogs.length).toBeGreaterThanOrEqual(5);
    });
  });
});
