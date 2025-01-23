import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/ws-auth.guard';

@WebSocketGateway({ cors: {origin :'*'} })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private userMap = new Map<string, string>();
    private users: number=0;
  
    constructor() {}
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.users++;
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.users--;
      client.rooms.clear();
    }
  
    //@UseGuards(JwtAuthGuard) // Use your existing HTTP Auth Guard
    @SubscribeMessage('sendMessage')
    async handleSendMessage(@MessageBody() messageDto, @ConnectedSocket() client: Socket) {
      messageDto = JSON.parse(messageDto);
      console.log('messageDto',messageDto.conversationId);
  
      const user = this.userMap.get(client.id);
      if (!user) {
        client.emit('error', 'Unauthorized: User information not found');
        console.log("Unauthorized is sent to client: User information not found");
        return;
      }
  
      const room = messageDto.conversationId.toString();
      const rooms = Array.from(client.rooms);
      console.log('rooms',rooms);
      if (!rooms.includes(room)) {
        client.emit('error', 'Unauthorized: You are not in this conversation');
        console.log("Unauthorized is sent to client: Not in room");
        return;
      }
      
      // const message = await this.conversationService.sendMessage(messageDto, user);
      // console.log('message',message," is sent");
      // this.server.to(messageDto.conversationId).emit('message', message);
      return "message";
    }
  
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinConversation')
    async handleJoinConversation(@MessageBody() conversationBody, @ConnectedSocket() client: any){
      console.log("hahahahahaha ");
      conversationBody = JSON.parse(conversationBody);
      /* if ( !await this.conversationService.validateUser(conversationBody.conversationId.toString(),client.user.id.toString() )){
        client.emit('error', 'Unauthorized');
        console.log("Unauthorized is sent to client");
        return;
      }
      this.userMap.set(client.id, client.user.id);
      client.join(conversationBody.conversationId);
      console.log(client.rooms)
      console.log(`Client ${client.id} joined conversation ${conversationBody.conversationId}`);
      this.server.emit('joined', "Hello everhoenr ererere"); */
    }
  
    @SubscribeMessage('leaveConversation')
    async handleLeaveConversation(@MessageBody() conversationBody, @ConnectedSocket() client: any){
      conversationBody = JSON.parse(conversationBody);
      this.userMap.delete(client.id);
      client.leave(conversationBody.conversationId);
      console.log(`Client ${client.id} left conversation ${conversationBody.conversationId}`);
    }

    @SubscribeMessage('listenUpdate')
    async handleListenUpdate(@MessageBody() ArticleId,@ConnectedSocket() client: any){
      client.join(ArticleId);
    }

    
  
}
