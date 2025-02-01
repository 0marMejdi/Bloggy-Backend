import {Model} from 'mongoose';
import {Notification} from './notification.entity';

export interface INotificationModel extends Model<Notification> {
    aggregatePaginate: any;
}
