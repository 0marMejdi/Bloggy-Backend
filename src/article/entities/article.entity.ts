import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../users/entities/user.entity";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@Schema({ timestamps: true }) // Enable createdAt and updatedAt
export class Article {
  constructor(userId: string) {
    this.id = null;
    this.title = null;
    this.content = null;
    this.slug = null;
    this.upvotes=0;
    this.downvotes=0;
    this.voters=[];
    
    this.images = [];
    this.owner = userId;
  }

  static fromDoc(doc: any): Article {
    const { _id = null, __v = null, ...prod } = { ...doc };
    return prod;
  }

  static fromArray(docs: any[]): Article[] {
    return docs.map((doc) => Article.fromDoc(doc));
  }

  @Prop({ required: true, unique: true })
  id: string;
  @Prop({ required: true , default:null})

  fatherId: string;
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  upvotes: number;

  @Prop({ required: true })
  downvotes: number;

  @Prop({ required: true })
  voters: Array<{ voterId: string; vote: string }>;

  @Prop()
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: string;






  @Prop({ required: true, default: [] })
  images: string[];
  

}
