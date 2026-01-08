import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AdminGateway } from '../../src/realtime/admin.gateway';

describe('AdminGateway', () => {
  it('broadcast emits on server', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test' })],
      providers: [AdminGateway],
    }).compile();
    const gw = moduleRef.get(AdminGateway);
    const emit = jest.fn();
    // @ts-ignore
    gw.server = { emit };
    gw.broadcast('productos.updated', { id: 1 });
    expect(emit).toHaveBeenCalledWith('productos.updated', { id: 1 });
  });

  it('rejects connection without valid token', () => {
    const jwt = new JwtService({ secret: 'test' });
    const gw = new AdminGateway(jwt);
    const disconnect = jest.fn();
    const emit = jest.fn();
    // @ts-ignore
    gw.server = { emit };
    // @ts-ignore
    gw.handleConnection({ handshake: { query: {} }, disconnect } as any);
    expect(disconnect).toHaveBeenCalled();
  });
});
