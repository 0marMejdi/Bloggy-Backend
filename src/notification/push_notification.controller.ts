import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';


@Controller('notification')
export class PushNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('subscribe')
  async subscribe(@Body() subscriptionDto) {
    const subscription = subscriptionDto.subscription;
    subscription.userId = subscriptionDto.userId;
    await this.notificationService.saveSubscription(subscription);
    return { message: 'Subscription successful' };
  }
}
