import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { NotificationService } from "./notification.service";
import { User } from "../users/entities/user.entity";

import { ApiTags } from "@nestjs/swagger";


@Controller("Notification")
@ApiTags("Notifications")
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}

  @Get("received")
  getPendingNotifications() {
    return this.NotificationService.getNotifications(false);
  }

  @Get("received/all")
  getAllNotifications() {
    return this.NotificationService.getNotifications(true);
  }

  @Patch("grant/:userId/")
  async acceptNotification(@Param("userId") id: string) {
    await this.NotificationService.respondNotification(id, true);
    return { message: "access granted" };
  }

  @Patch("revoke/:userId/")
  async refuseNotification(@Param("userId") id: string) {
    await this.NotificationService.respondNotification(id, false);
    return { message: "access revoked" };
  }

  @Post("request")
  async requestNotification(@CurrentUser() user: User) {
    const res = await this.NotificationService.requestNotification(user.id.toString());
    return {
      message: res
        ? "Your Notification is Pending"
        : "Your Notification is already Approved",
    };
  }

  @Delete("cancel")
  async cancelNotification(@CurrentUser() user: User) {
    const res = await this.NotificationService.cancelNotification(user.id.toString());
    return {
      message: res ? "canceled successfully" : "unable to cancel your Notification. ",
    };
  }

  @Get("sent")
  async getMine(@CurrentUser() user: User) {
    return this.NotificationService.getNotificationByUserId(user.id.toString());
  }
}
