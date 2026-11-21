import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { corsOrigins } from '../common/cors-origins.js';

@WebSocketGateway({ cors: { origin: corsOrigins() } })
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  notifyCalled(queueNumber: number) {
    this.server.emit('queue:called', { queueNumber });
  }
}
