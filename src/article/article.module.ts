import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { ArticleSchema } from "../schemas/Article.schema";
import { ImageModule } from "../image/image.module";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ArticleByIdPipe } from "./pipe/article-by-id.pipe";
import { UsersModule } from "../users/users.module";
import { NotificationModule } from "src/notification/notification.module";
import { UserSchema } from "src/schemas/User.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Article",
        schema: ArticleSchema,
      },
      {
        name:"User",
        schema:UserSchema
      }
     
    ]),
    ImageModule,
    EventEmitterModule.forRoot(),
    UsersModule,
    NotificationModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleByIdPipe],
  exports: [ArticleService],
})
export class ArticleModule {}
