import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema } from "../schemas/Notification.schema";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: "Notification",
        schema: NotificationSchema,
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
