import { SchemaFactory } from "@nestjs/mongoose";
import { Notification } from "../Notification/entities/Notification.entity";

export const NotificationSchema = SchemaFactory.createForClass(Notification);
