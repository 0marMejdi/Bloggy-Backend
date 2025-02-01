import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {NotificationService} from './notification.service';
import {NotificationController} from './notification.controller';
import {NotificationGateway} from './notification.gateway';
import {Notification, NotificationSchema} from "./entities/notification.entity";

import { PushSubscriptionSchema, PushSubscription } from './entities/push-subscription.entity';
import { PushNotificationController } from './push_notification.controller';
import { PushNotificationService } from './push_notifications.service';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        MongooseModule.forFeature([
            {name: PushSubscription.name, schema: PushSubscriptionSchema},
            {name: Notification.name, schema: NotificationSchema},
            {name: User.name, schema: User},
            {name: Article.name, schema: Article}
        ])
    ],
    controllers: [NotificationController, PushNotificationController],
    providers: [NotificationService, NotificationGateway, PushNotificationService ],
    exports: [NotificationService, PushNotificationService, MongooseModule.forFeature([{name: PushSubscription.name, schema: PushSubscriptionSchema}])
    ]
})
export class NotificationModule {
}
