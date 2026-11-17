import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  notifyCalled(queueNumber: number) {
    this.server.emit('queue:called', { queueNumber });
  }
}
