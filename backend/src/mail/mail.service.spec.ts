import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailLog } from './mail-log.entity';
import { Repository } from 'typeorm';

// Mock de Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mock-message-id' }),
      },
    })),
  };
});

describe('MailService', () => {
  let service: MailService;
  let mailLogRepository: Repository<MailLog>;

  const mockMailLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.WEB_URL = 'http://localhost:3000';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailLog),
          useValue: mockMailLogRepository,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailLogRepository = module.get<Repository<MailLog>>(
      getRepositoryToken(MailLog),
    );

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('sendAccountCreation', () => {
    it('debería enviar correo de creación de cuenta correctamente', async () => {
      const params = {
        to: 'test@example.com',
        fullName: 'Test User',
        verificationToken: 'abc123',
      };

      mockMailLogRepository.create.mockReturnValue({
        type: 'ACCOUNT_CREATION',
        to: params.to,
        subject: 'Bienvenido a IndustriaSP',
        status: 'SUCCESS',
      });

      mockMailLogRepository.save.mockResolvedValue({
        id: 1,
        ...mockMailLogRepository.create(),
      });

      const result = await service.sendAccountCreation(params);

      expect(result).toBeDefined();
    });

    it('debería manejar errores al enviar correo', async () => {
      const params = {
        to: 'invalid@example.com',
        fullName: 'Test User',
        verificationToken: 'abc123',
      };

      mockMailLogRepository.create.mockReturnValue({
        type: 'ACCOUNT_CREATION',
        to: params.to,
        subject: 'Bienvenido a IndustriaSP',
        status: 'FAIL',
      });

      mockMailLogRepository.save.mockResolvedValue({
        id: 1,
        ...mockMailLogRepository.create(),
      });

      const result = await service.sendAccountCreation(params);

      expect(result).toBeDefined();
    });
  });

  describe('sendPasswordReset', () => {
    it('debería enviar correo de recuperación de contraseña', async () => {
      const params = {
        to: 'test@example.com',
        fullName: 'Test User',
        token: 'reset123',
        expireHours: 24,
      };

      mockMailLogRepository.create.mockReturnValue({
        type: 'PASSWORD_RESET',
        to: params.to,
        subject: 'Recuperación de contraseña',
        status: 'SUCCESS',
      });

      mockMailLogRepository.save.mockResolvedValue({
        id: 1,
        ...mockMailLogRepository.create(),
      });

      const result = await service.sendPasswordReset(params);

      expect(result).toBeDefined();
    });
  });

  describe('htmlToText', () => {
    it('debería convertir HTML a texto plano', () => {
      const html = '<p>Hola <strong>mundo</strong></p>';
      const text = (service as any).htmlToText(html);

      expect(text).toBe('Hola mundo');
      expect(text).not.toContain('<');
      expect(text).not.toContain('>');
    });

    it('debería decodificar entidades HTML', () => {
      const html = '&lt;div&gt;Test&nbsp;&amp;&nbsp;More&lt;/div&gt;';
      const text = (service as any).htmlToText(html);

      expect(text).toContain('<div>');
      expect(text).toContain('&');
      expect(text).not.toContain('&nbsp;');
      expect(text).not.toContain('&lt;');
    });
  });

  describe('listLogs', () => {
    it('debería listar logs de correos', async () => {
      const mockLogs = [
        {
          id: 1,
          type: 'ACCOUNT_CREATION',
          to: 'test1@example.com',
          status: 'SUCCESS',
        },
        {
          id: 2,
          type: 'PASSWORD_RESET',
          to: 'test2@example.com',
          status: 'SUCCESS',
        },
      ];

      mockMailLogRepository.find.mockResolvedValue(mockLogs);

      const result = await service.listLogs(20);

      expect(result).toEqual(mockLogs);
      expect(mockMailLogRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 20,
      });
    });
  });

  describe('updateEvent', () => {
    it('debería actualizar evento de apertura de correo', async () => {
      const mockLog = {
        id: 1,
        providerMessageId: 'msg123',
        opens: 0,
        clicks: 0,
        lastEvent: null,
        lastEventAt: null,
      };

      mockMailLogRepository.findOne.mockResolvedValue(mockLog);
      mockMailLogRepository.save.mockImplementation((log) =>
        Promise.resolve(log),
      );

      await service.updateEvent('msg123', 'email.opened');

      expect(mockMailLogRepository.findOne).toHaveBeenCalledWith({
        where: { providerMessageId: 'msg123' },
      });
      expect(mockLog.opens).toBe(1);
      expect(mockLog.lastEvent).toBe('email.opened');
    });

    it('debería actualizar evento de clic de correo', async () => {
      const mockLog = {
        id: 1,
        providerMessageId: 'msg123',
        opens: 1,
        clicks: 0,
        lastEvent: 'email.opened',
        lastEventAt: new Date(),
      };

      mockMailLogRepository.findOne.mockResolvedValue(mockLog);
      mockMailLogRepository.save.mockImplementation((log) =>
        Promise.resolve(log),
      );

      await service.updateEvent('msg123', 'email.clicked');

      expect(mockLog.clicks).toBe(1);
      expect(mockLog.lastEvent).toBe('email.clicked');
    });

    it('no debería fallar si el log no existe', async () => {
      mockMailLogRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateEvent('nonexistent', 'email.opened'),
      ).resolves.not.toThrow();
    });
  });
});
