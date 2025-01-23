import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {console.log("instanciated guards");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.headers['authorization'];
    //console.log(client);
    

    if (!authToken) {
      client.emit('error', 'Missing authorization token');
      console.log("Missing authorization token");
    }

    const token = authToken.split(' ')[1]; // Assuming 'Bearer <token>'

    try {
      const user = this.jwtService.verify(token);     
      client.user = user;
      //console.log("user");
      //console.log("user",client);
      //console.log("##########in wsauth##########");
      return true;
    } catch (error) {
      client.emit('error', 'Invalid token');
      console.log("Invalid token",error);
      return false;
    }
  }
}
