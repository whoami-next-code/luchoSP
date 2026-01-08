import request from 'supertest';

const BASE = process.env.API_URL || 'http://localhost:3001';

describe('Carga /api/productos', () => {
  it('responde rápido bajo carga concurrente', async () => {
    const N = 30;
    const start = Date.now();
    await Promise.all(
      Array.from({ length: N }).map(() =>
        request(BASE).get('/api/productos').expect(200),
      ),
    );
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});
