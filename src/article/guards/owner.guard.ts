import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ArticleService } from "../article.service";

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly articleService: ArticleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Extract article ID from URL parameters
    const articleId = req.params.id;
    console.log(articleId);
    console.log(req.user);

    // Find the article by ID
    const article = await this.articleService.findOne(articleId);

    // Check if the article exists
    if (!article) {
      return false;
    }
    if (!req.user) return false;

    // Compare the article's user ID with the user ID in the request
    const productOwnerId = article.owner; // assuming the owner field is named 'owner'
    const userId = req.user.id; // assuming the user's ID is available in req.user.id

    return productOwnerId === userId;
  }
}
