import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification } from "./entities/notification.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel("Notification") private readonly NotificationModel: Model<Notification>,
    private readonly usersService: UsersService,
  ) {}

  async requestNotification(user: string) {
    const old = await this.NotificationModel.findOne({ user: user }).exec();

     if (old) {
      return await this.NotificationModel    }

    const doc = new this.NotificationModel({
      user: user,
    });
    doc.id = doc._id.toString();
    return await doc.save();
  }

  async getNotifications(isEverything: boolean) {
    const criteria = isEverything ? {} : {  };
    const Notifications = await this.NotificationModel
      .find(criteria)
      .populate("user")
      .lean()
      .exec();
    const self = this;
    return Notification.fromArray(Notifications);
  }

  async respondNotification(user: string, grant: boolean) {
    await this.NotificationModel
      .findOneAndUpdate(
        { user: user },
        {  },
      )
      .lean()
      .exec();
  }

  async cancelNotification(user: string) {
    const Notification = await this.NotificationModel.findOne({ user: user }).lean().exec();
    if (!Notification) {
      return false;
    }
    await this.NotificationModel.findOneAndDelete({ user: user }).lean().exec();
    return true;
  }

  

  async getNotificationByUserId(user: string) {
    return Notification.fromDoc(
      await this.NotificationModel.findOne({ user: user }).lean().exec(),
    );
  }
}
