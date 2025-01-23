import { SchemaFactory } from "@nestjs/mongoose";
import { Notification } from "../Notification/entities/notification.entity";

export const NotificationSchema = SchemaFactory.createForClass(Notification);
