import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { Article } from '../entities/article.entity';


@Injectable()
export class ArticleByIdPipe implements PipeTransform {
  constructor(private readonly articleService: ArticleService) {}

  async transform(value: any, metadata: ArgumentMetadata) : Promise<Article> {
    const articleId = value;

    // Validate the article ID format if necessary (e.g., ObjectId for MongoDB)
    if (!this.isValidId(articleId)) {
      throw new BadRequestException('Invalid article ID format');
    }

    // Fetch the article
    const article = await this.articleService.findOne(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Return the article to be appended to the request object
    return article;
  }

  // Optional: Add a method to validate the article ID format
  private isValidId(id: string): boolean {
    if (!id)
        return false;
    return true; // Placeholder: assume all IDs are valid
  }
}
