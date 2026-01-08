import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let supabase: any;
  const users: Partial<UsersService> = {
    findByEmail: jest.fn(),
    findBySupabaseUid: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };
  const jwt = { sign: jest.fn(() => 'token') } as any as JwtService;
  const mail: Partial<MailService> = {
    sendAccountCreation: jest.fn(() => Promise.resolve({ ok: true })),
    sendPasswordReset: jest.fn(() => Promise.resolve({ ok: true })),
    sendVerification: jest.fn(() => Promise.resolve({ ok: true })),
  };
  const audit = { log: jest.fn() } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';

    supabase = {
      auth: {
        admin: {
          createUser: jest.fn(),
          generateLink: jest.fn(),
        },
      },
    };
    (createClient as unknown as jest.Mock).mockReturnValue(supabase);

    service = new AuthService(users as any, jwt, mail as any, audit);
  });

  it('rechaza registro con email existente', async () => {
    supabase.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: { message: 'already registered' },
    });

    await expect(
      service.register({
        email: 'a@b.com',
        password: 'secret123',
        fullName: 'Test',
        phone: '+51 987654321',
      }),
    ).rejects.toThrow('El correo ya está registrado.');
  });

  it('permite registro con teléfono de Perú', async () => {
    supabase.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: 'supabase-uid-1', email: 'new@b.com' } },
      error: null,
    });
    supabase.auth.admin.generateLink.mockResolvedValue({
      data: { properties: { action_link: 'https://example.com/verify' } },
      error: null,
    });

    (users.findBySupabaseUid as any).mockResolvedValue({
      id: 2,
      email: 'new@b.com',
      fullName: 'New User',
      verified: false,
    });

    const res = await service.register({
      email: 'new@b.com',
      password: 'secret123',
      fullName: 'New User',
      phone: '+51 987654321',
    });
    expect(res.user.email).toBe('new@b.com');
    expect(mail.sendVerification).toHaveBeenCalled();
    expect(audit.log).toHaveBeenCalledWith('user.registered_backend', 2, {
      email: 'new@b.com',
      method: 'backend_admin_api',
    });
  });
});
