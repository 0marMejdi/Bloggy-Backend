import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from 'src/schemas/User.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([

          { name: 'User', schema: UserSchema },
        ]),
        UsersModule,
      ],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
