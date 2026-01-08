import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws/admin',
  cors: { origin: true, credentials: true },
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('AdminGateway');

  constructor(private readonly jwt: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token = (client.handshake.query?.token as string) || '';
      const payload = this.jwt.verify(token);
      const role = payload?.role;
      if (!role) {
        client.disconnect(true);
        return;
      }
      
      // Permitir CLIENTE también, para recibir actualizaciones de sus pedidos/cotizaciones
      if (role !== 'ADMIN' && role !== 'VENDEDOR' && role !== 'CLIENTE') {
         client.disconnect(true);
         return;
      }

      client.join(`role:${role}`);
      client.emit('status', { connected: true });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.verbose(`disconnect ${client.id}`);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('ping')
  onPing(@MessageBody() data: any) {
    void data;
    return { pong: true, t: Date.now() };
  }
}
