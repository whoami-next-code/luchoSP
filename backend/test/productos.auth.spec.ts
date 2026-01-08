import request from 'supertest';

const BASE = process.env.API_URL || 'http://localhost:3001';

describe('Auth en /api/productos', () => {
  it('rechaza creación sin token', async () => {
    await request(BASE)
      .post('/api/productos')
      .field('name', 'Test')
      .field('price', '9.99')
      .field('stock', '1')
      .expect(401);
  });
});
