import { SchemaFactory } from '@nestjs/mongoose';
import { Article } from 'src/article/entities/article.entity';


export const ArticleSchema = SchemaFactory.createForClass(Article);

