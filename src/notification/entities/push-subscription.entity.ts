import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PushSubscription extends Document {
  @Prop({ required: true })
  endpoint: string;

  @Prop({
    type: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    required: true
  })
  keys: {
    p256dh: string;
    auth: string;
  };

  @Prop({ required: true })
  userId : string;
}

export const PushSubscriptionSchema = SchemaFactory.createForClass(PushSubscription);
