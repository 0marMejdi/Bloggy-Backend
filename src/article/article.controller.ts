import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { User } from "../users/entities/user.entity";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Article } from "./entities/article.entity";
import { Roles } from "../auth/roles/roles.decorator";
import { ArticleByIdPipe } from "./pipe/article-by-id.pipe";

@ApiTags("article")
//@Roles(['admin'])
@Controller("article")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Put("/:id/image/change/:index?")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor("image", {
			storage: memoryStorage(), // Use memory storage
		})
	)
	async changeImage(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Param("id", ArticleByIdPipe) article: Article,
		@Param("index", new DefaultValuePipe(0), ParseIntPipe) index: number
	) {
		await this.articleService.isOwner(article, user);
		return this.articleService.changeImage(article, file, index);
	}

	@Delete("/:id/image/delete/:index?")
	@UseGuards(JwtAuthGuard)
	async deleteImage(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Param("id", ArticleByIdPipe) article: Article,
		@Param("index", new DefaultValuePipe(0), ParseIntPipe) index: number
	) {
		await this.articleService.isOwner(article, user);
		return this.articleService.deleteImage(article, index);
	}
	@Get(":id/images")
	async getAllImages(
		@Param("id") id: string,
		@Param("index", new DefaultValuePipe(-1), ParseIntPipe) index: number
	) {
		return this.articleService.getAllImages(id);
	}

	@Get("find")
async findMultiple(
  @Query("images", new DefaultValuePipe(true), new ParseBoolPipe())
  images: boolean,
  @Query("comments", new DefaultValuePipe(true), new ParseBoolPipe())
  comments: boolean,
  @Query("ownerid", new DefaultValuePipe(null)) ownerid: string | null,
  @Query("content", new DefaultValuePipe(true), new ParseBoolPipe())
  content: boolean,
  @Query("page", new DefaultValuePipe(1), new ParseIntPipe()) page: number, // Add page parameter
  @Query("limit", new DefaultValuePipe(10), new ParseIntPipe()) limit: number // Add limit parameter
) {
  return this.articleService.findMultiple({
    images,
    comments,
    ownerid,
    content,
    page,
    limit,
  });
}
	@Get("comments/:id")
	async getCommentsById(
		@Query("images", new DefaultValuePipe(true), new ParseBoolPipe())
		images: boolean,
		@Query("content", new DefaultValuePipe(true), new ParseBoolPipe())
		content: boolean,
		@Param("id") id
	) {
		return this.articleService.getComments(id, { images, content });
	}
	@Post("/create/")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor("images")) // Handle multiple image uploads
	async submit(
		@Body() createArticleDto: CreateArticleDto,
		@UploadedFiles() images: Express.Multer.File[],
		@CurrentUser() user: User
	) {
		const id = await this.articleService.create(
			createArticleDto,
			user.id,
			images
		);
		return id;
	}

	@Post("/:id/image/add")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor("image", {
			storage: memoryStorage(), // Use memory storage
		})
	)
	async addImage(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Param("id", ArticleByIdPipe) article: Article
	) {
		await this.articleService.isOwner(article, user);
		return this.articleService.addImage(article, file);
	}

	@Get(":id/image/:index?")
	async getImageLink(
		@Param("id", ArticleByIdPipe) article: Article,
		@Param("index", new DefaultValuePipe(0), ParseIntPipe) index: number
	) {
		return this.articleService.getImageLink(article, index);
	}

	@Get()
	async findAll(
		@Query("noimage", new DefaultValuePipe("")) noimage: string = ""
	) {
		return this.articleService.findAll(noimage);
	}

	@Get("full/byUserId/:id")
	async findFullByUserId(@Param("id") id: string) {
		return this.articleService.findFullByUserId(id);
	}
	@Get("full")
	async findAllCommented() {
		return this.articleService.findAllCommented();
	}

	@Get("full/:id")
	async findOneCommented(@Param("id") id: string) {
		return this.articleService.findOneCommented(id);
	}

	@Get("property")
	@UseGuards(JwtAuthGuard)
	async getMyArticles(@CurrentUser() user) {
		return this.articleService.findByUserId(user.id);
	}

	@Get("owner/:id")
	async getArticleOwner(@Param("id") id: string) {
		return this.articleService.getArticleOwner(id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard)
	update(
		@Param("id") id: string,
		@Body() updateArticleDto: UpdateArticleDto
	) {
		return this.articleService.update(id, updateArticleDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.articleService.remove(id);
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		const article = await this.articleService.findOne(id);
		if (!article) {
			throw new NotFoundException(`Article with ID ${id} not found`);
		}
		return article;
	}

	@Get("search/:name")
	async search(@Param("name") name: string) {
		return this.articleService.searchByName(name);
	}

	@Post(":id/upvote")
	@UseGuards(JwtAuthGuard)
	async upvote(@Param("id") articleId: string, @CurrentUser() user: User) {
		return this.articleService.vote(articleId, user.id, "upvote");
	}
	@Post(":id/downvote")
	@UseGuards(JwtAuthGuard)
	async downvote(@Param("id") articleId: string, @CurrentUser() user: User) {
		return this.articleService.vote(articleId, user.id, "downvote");
	}
}
