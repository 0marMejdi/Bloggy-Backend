import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as path from "path"
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Article,
} from "./entities/article.entity";
import { ImageService } from "../image/image.service";
import { User } from "../users/entities/user.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";


require("dotenv").config();
const fs = require("fs").promises;

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel("Article") private readonly articleModel: Model<Article>,
  ) {}




  /**
   * Upload Article Object into Database ! Highly Recommended for any save
   * @param article : Article
   *
   */
  async add(article: Article) {
    const productDocument = new this.articleModel(article);
    productDocument.id = productDocument._id.toString();
    return await productDocument.save();
  }

  pathFromId(id: string, index: number): string {
    return `uploads/articles/${id}/${index}.jpg`;
  }

  async create(createArticleDto: CreateArticleDto, userId: string, images?: Express.Multer.File[]) {
    // Initialize the new article object
    let newArticle = new Article(userId);
    if (!newArticle.fatherId) newArticle.fatherId = null;
    newArticle = {
      ...newArticle,
      ...createArticleDto,
    };

    // Save the article document to the database
    const articleDocument = new this.articleModel(newArticle);
    articleDocument.id = articleDocument._id.toString();
    const added = await articleDocument.save();

    // Handle optional image uploads
    if (images && images.length > 0) {
      try {
        // Encode each image to Base64 and store them in the article's `images` array
        const encodedImages = images.map((image) => image.buffer.toString('base64'));

        // Update the article document with the Base64-encoded images
        articleDocument.images = encodedImages;
        await articleDocument.save();
      } catch (e) {
        console.error('Error encoding images:', e);
      }
    }

    return added.id;
  }




  async addImage(article: Article, imageFile: Express.Multer.File) {
    const indecies = article.images.map((path) =>
      Number(path.split("/").pop().split(".")[0]),
    );
    const next = indecies.length == 0 ? 0 : Math.max(...indecies) + 1;
    await fs.mkdir(`uploads/products/${article.id}`, { recursive: true });
    const path = this.pathFromId(article.id, next);
    await fs.writeFile(path, Buffer.from(imageFile.buffer));
    await this.articleModel.findByIdAndUpdate(article.id, {
      images: [...article.images, path],
    });
    return path;
  }

  async getArticleOwner(articleId: string) {
    const article = await this.articleModel
      .findOne({ id: articleId })
      .populate("owner")
      .lean()
      .exec();
    if (!article) {
      throw new NotFoundException("Article not found");
    }

    return User.fromDoc(article.owner);
  }

  async findAll(): Promise<Article[]> {
    return (await this.articleModel.find().lean().exec()).map((doc) =>
      Article.fromDoc(doc),
    );
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    //get the article
    const article = await this.articleModel.findById(id).exec();
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    //emit the event
    return updatedArticle;
  }

  async remove(id: string): Promise<Article> {
    const removedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    if (!removedArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return removedArticle;
  }

  async getFiltered(
    category: string,
    pageNumber: number = 1,
    sortBy: string,
    pageSize = 21,
  ) {
    const query = this.articleModel;
    const filter: any = {};
    if (category) filter.category = category;

    if (!pageNumber && pageNumber < 1) pageNumber = 1;

    const results = await query
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
      .exec();

    return Article.fromArray(results);
  }

  async findByUserId(id) {
    return (await this.articleModel.find({ owner: id }).lean().exec()).map(
      (doc) => Article.fromDoc(doc),
    );
  }

  /**
   * Search for products by name.
   * @param name The name of the article to search for.
   */
  async searchByName(name: string): Promise<Article[]> {
    const products = await this.articleModel
      .find({ name: { $regex: name, $options: "i" } })
      .lean()
      .exec();

    return products.map((doc) => Article.fromDoc(doc));
  }

  async isOwner(prod: Article, user: User): Promise<void> {
    if (prod.owner.toString() !== user.id.toString())
      throw new ForbiddenException("This Article is not yours");
  }

  async getImageLink(prod: Article, index: number) {
    if (prod.images && prod.images.length === 0)
      return "uploads/products/default.jpg";
    if (prod.images.length <= index || index < 0)
      throw new NotFoundException(`Image N° ${index + 1} cannot be found`);
    return prod.images[index];
  }

  async getAllImages(id: string) {
    const prod = await this.findOne(id);
    if (!prod) throw new NotFoundException("Article not found");
    return prod.images;
  }
  async vote(articleId: string, userId: string, action: 'upvote' | 'downvote') {
    const article = await this.articleModel.findById(articleId);
  
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    // Find the existing vote of the user in the voters array
    const existingVote = article.voters.find((vote) => vote.voterId === userId);
  
    switch (action) {
      case 'upvote':
        if (!existingVote) {
          // User has not voted yet, create a new upvote
          article.voters.push({ voterId: userId, vote: 'upvote' });
          article.upvotes += 1;
        } else {
          if (existingVote.vote === 'upvote') {
            // User already upvoted, reset the vote
            existingVote.vote = '';
            article.upvotes -= 1;
          } else if (existingVote.vote === '') {
            // User hasn't voted, so now they are upvoting
            existingVote.vote = 'upvote';
            article.upvotes += 1;
          } else if (existingVote.vote === 'downvote') {
            // User downvoted, switch to upvote
            existingVote.vote = 'upvote';
            article.downvotes -= 1;
            article.upvotes += 1;
          }
        }
        break;
  
      case 'downvote':
        if (!existingVote) {
          // User has not voted yet, create a new downvote
          article.voters.push({ voterId: userId, vote: 'downvote' });
          article.downvotes += 1;
        } else {
          if (existingVote.vote === 'downvote') {
            // User already downvoted, reset the vote
            existingVote.vote = '';
            article.downvotes -= 1;
          } else if (existingVote.vote === '') {
            // User hasn't voted, so now they are downvoting
            existingVote.vote = 'downvote';
            article.downvotes += 1;
          } else if (existingVote.vote === 'upvote') {
            // User upvoted, switch to downvote
            existingVote.vote = 'downvote';
            article.upvotes -= 1;
            article.downvotes += 1;
          }
        }
        break;
  
      default:
        throw new BadRequestException('Invalid action.');
    }
  
    await article.save();
    return article;
  }
  

  async changeImage(prod: Article, file, index: number) {
    if (!Boolean(prod.images) || !prod.images[index])
      throw new NotFoundException(`Image with index ${index} is not found`);
    // await fs.rm(prod.images[index]);
    console.log(file);
    console.log("inside change image handler");
    await fs.writeFile(prod.images[index], Buffer.from(file.buffer));
  }
}
