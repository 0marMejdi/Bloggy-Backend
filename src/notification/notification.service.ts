import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {filterNotificationDto} from './dto/filterNotification.dto';
import {NotificationDto} from './dto/notification.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {NotificationGateway} from "./notification.gateway";

import { ObjectId } from 'mongodb';
import { PushNotificationService } from './push_notifications.service';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
@Injectable()
export class NotificationService {


    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<Notification>,
        @InjectModel(Article.name) private articleModel: Model<Article>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel('PushSubscription') private pushSubscriptionModel: Model<PushSubscription>,
        private notificationGateway: NotificationGateway,
        private pushNotificationService: PushNotificationService
    ) {
    }

    async createNotification(notificationDto: NotificationDto) {
        try {
            let html;
            const notification = new this.notificationModel(notificationDto);
    
            const receiver = await this.userModel.findById(notificationDto.receiverId);
            const article = await this.articleModel.findById(notificationDto.articleId,{images:0,});
            let socketReponse :any = {};  
            if (receiver) {
                const sender = await this.userModel.findById(notificationDto.senderId);
              
                
                socketReponse = {
                    userId: receiver._id,
                    msg: notificationDto.message,
                    article,
                    receiver,
                    sender,
                };
                // await this.smsService.sendSmsToPhone(notificationDto.message, parseInt(expert.tel));

                // await this.mailerService.sendMail(expert.email, expert.fullName, 'Une nouvelle mission vous attend!', html);
            } else {
                // let statusFr = '';
                const sender = await this.userModel.findById(notificationDto.senderId);
                const receiver = await this.userModel.findById(notificationDto.receiverId);
                await sender.save();

                
                socketReponse = {
                    userId: receiver._id,
                    msg: notificationDto.message,
                    article,
                    receiver,
                    sender
                };

                // await this.smsService.sendSmsToPhone(notificationDto.message, parseInt(client.tel));

                // await this.mailerService.sendMail(client.email, client.fullName, objet, html);
            }
            const notif = await notification.save();
            const receivers = this.notificationGateway.getSocketIdForUser(receiver.id);
            if (receivers.length==0){
                new Logger('Notification Service').warn("no subscribers for this receiver");

            }else{
                this.notificationGateway.server.to(receivers).emit('api', {...socketReponse, notif});
            }
            // this.notificationGateway.server.emit('api', {...socketReponse, notif});
            
            const receiverId = notificationDto.receiverId;
            const payload = JSON.stringify({
              title: 'New Notification',
              body: notificationDto.message,
              data: {
                url: '/notifications',
              },
            });
            
            // Fetch subscriptions for the specific receiver from the database
            const subscriptions = await this.pushSubscriptionModel.find({ userId: receiverId });
            
            for (const subscription of subscriptions) {
              try {
                await this.pushNotificationService.sendNotification(subscription, payload);
              }
              catch(e){
              
              }
            }
            return notif;
        } catch (error) {
            //throw new InternalServerErrorException(error.message);
            return error.stack;
        }
    }

    async fetchNotificationsPaginate(receiverId) {
        try {
            
            return await this.notificationModel.find({receiverId}).lean().exec();
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    async updateNotificationsByIds(ids: string[]) {

        try {
            await this.notificationModel.updateMany(
                {
                    _id: {
                        $in: ids
                    }
                },
                {
                    $set: {is_read: true}
                },
                {
                    multi: true
                }
            );
            return true;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
  async findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  async updateNotificationById(id) {
      try {
           await this.notificationModel.updateOne({_id: id}, {$set: {is_read: true}})
           return this.notificationModel.findById(id);
      } catch (error) {
          return new InternalServerErrorException(error);
      }
  }

  async saveSubscription(subscription) {
      await this.pushSubscriptionModel.deleteMany({ endpoint: subscription.endpoint });
    //
    //   const ExistingSubscription = await this.pushSubscriptionModel.find({ endpoint: subscription.endpoint });
    // if (ExistingSubscription) {
    //   // return ExistingSubscription;
    // }
    try {
      const pushSubscription = new this.pushSubscriptionModel(subscription);
      return await pushSubscription.save();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
