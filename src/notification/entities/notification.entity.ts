import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Notification {
  constructor() {}

  static fromDoc(doc: any): Notification {
    const { _id = null, __v = null, ...user } = { ...doc };

    return user;
  }

  static fromArray(docs: any[]): Notification[] {
    return docs.map((doc) => Notification.fromDoc(doc));
  }

  @Prop()
  id: string;
  @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
  user: string;
  
}
