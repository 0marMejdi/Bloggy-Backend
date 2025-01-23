import { SchemaFactory } from "@nestjs/mongoose";
import { Notification } from "../notification/entities/notification.entity";

export const NotificationSchema = SchemaFactory.createForClass(Notification);
