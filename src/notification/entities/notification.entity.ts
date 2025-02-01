import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';

@Schema({timestamps: true})
export class Notification extends Document {
    @Prop()
    message: string;

    @Prop({default: false})
    is_read: boolean;

    @Prop({type: Types.ObjectId, ref: 'User'})
    senderId: any;

    @Prop({type: Types.ObjectId, ref: 'User'})
    receiverId: any;

    @Prop({type: Types.ObjectId, ref: 'Article'})
    articleId: any;

    @Prop()
    url : string; 
    /*  @Prop({ default: Date.now })
    createdAt: Date; */
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.pre('save', function (next) {
    // this._id is a string
    this.set('senderId', new Types.ObjectId(this.senderId), {strict: false});
    this.set('receiverId', new Types.ObjectId(this.receiverId), {strict: false});
    this.set('articleId', new Types.ObjectId(this.articleId), {strict: false});
    next();
});
NotificationSchema.plugin(aggregatePaginate);
