import { CaptchaService } from './captcha.service';

describe('CaptchaService', () => {
  it('retorna true en entorno de test si no hay secreto', async () => {
    process.env.TURNSTILE_SECRET_KEY = '';
    process.env.NODE_ENV = 'test';
    const svc = new CaptchaService();
    const ok = await svc.verify('dummy');
    expect(ok).toBe(true);
  });
});
