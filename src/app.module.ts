import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ArticleModule } from "./article/article.module";
import { AuthModule } from "./auth/auth.module";
import * as dotenv from "dotenv";
import { ImageModule } from "./image/image.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { ParseBoolPipe } from "@nestjs/common/pipes";
import { SocketModule } from "./socket/socket.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { NotificationModule } from './Notification/notification.module';

dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: "uploads",
      serveRoot: "/uploads", // This will serve files from /uploads URL path
    }),
    MongooseModule.forRoot("mongodb+srv://omar:wanrltw1234@clusteredindex.t9rja.mongodb.net"),

    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ArticleModule,
    AuthModule,
    ImageModule,
    MorganModule,
    SocketModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    ParseBoolPipe,
    AppService,
    /*     {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    }, */
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
  ],
})
export class AppModule {}
