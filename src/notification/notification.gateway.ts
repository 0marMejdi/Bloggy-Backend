import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Subscriber {
  userId: string;
  socketId: string;
}
@WebSocketGateway({perMessageDeflate:false,httpCompression:false})

export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private subscribers: Subscriber[] = [];
  private logger: Logger = new Logger('NotificationGateway');

  constructor(private readonly jwt: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }
  public getSocketIdForUser(userId:string){
    return this.subscribers.filter(sub=>sub.userId===userId).map(sub=>sub.socketId);
  }

  private async getUserFromToken(client: Socket): Promise<string | null> {
    let token = client.handshake.headers.authorization ?? client.handshake.query.authorization;
    if (!token) return null;
    if (Array.isArray(token)) token = token[0];

    try {
      const user: any = await this.jwt.verify(token);
      return user && user.id ? user.id : null;
    } catch (error) {
      this.logger.error(`JWT verification failed for client ${client.id}`, error);
      return null;
    }
  }

  async handleConnection(client: Socket) {
    const userId = await this.getUserFromToken(client);
    if (!userId) {
      this.logger.error(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
      return;
    }

    this.subscribers.push({ userId, socketId: client.id });
    this.logger.log(`Client connected: ${client.id} as user ${userId}`);
    this.logger.debug(`Subscribers: ${JSON.stringify(this.subscribers)}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = await this.getUserFromToken(client);
    if (userId) {
      this.subscribers = this.subscribers.filter(sub => sub.userId !== userId);
      this.logger.log(`Client disconnected: ${client.id} for user ${userId}`);
    }
  }
}
