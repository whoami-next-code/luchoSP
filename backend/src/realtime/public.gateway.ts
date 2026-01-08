import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws/public',
  cors: { origin: true, credentials: true },
})
export class PublicGateway {
  @WebSocketServer() server: Server;
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
