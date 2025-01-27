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
  CommentedArticle,
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



  async findFullByUserId(id: string) {
    let res = (await this.articleModel.find({owner:id}).lean().exec()).map((doc) =>
      Article.fromDoc(doc),
    );
    return this.findArticlesOf(res,null,true);  }
  
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
    // Encode the image file into Base64 format
    const encodedImage = imageFile.buffer.toString('base64');
  
    // Add the encoded image to the `images` array
    article.images.push(encodedImage);
  
    // Update the article document in the database
    await this.articleModel.findByIdAndUpdate(article.id, {
      images: article.images,
    });
  
    return { message: "Image added successfully", imageIndex: article.images.length - 1 };
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

  async findAll(noimage: string): Promise<Article[]> {
    let res = (await this.articleModel.find().lean().exec()).map((doc) =>
      Article.fromDoc(doc),
    );
  
    // If noimage is "true", remove the images attribute from each article
    if (noimage === "true") {
      //@ts-ignore
      res = res.map((article) => {
        const { images, ...rest } = article; // Destructure to exclude images
        return rest; // Return the article without the images attribute
      });
    }
  
    return res;
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
    const article = await this.articleModel.findById(articleId).lean().exec();
  
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    // Find the existing vote of the user in the voters array
    const existingVoteIndex = article.voters.findIndex((vote) => vote.voterId === userId);
    console.log("article");
    console.log(article);
    console.log("article.voters");
    console.log(article.voters);

    console.log("existingVote");
    console.log(existingVoteIndex);
  


  
    switch (action) {
      case 'upvote':
        console.log(`Action: upvote, User ID: ${userId}`);
        if (existingVoteIndex==-1) {
          console.log('User has not voted yet. Adding new upvote.');
          article.voters.push({ voterId: userId, vote: 'upvote' });
          article.upvotes += 1;
          console.log(`Article upvotes increased to: ${article.upvotes}`);
        } else {
          if (article.voters[existingVoteIndex].vote === 'upvote') {
            console.log('User already upvoted. Resetting the vote.');
            article.voters[existingVoteIndex].vote = null;
            article.upvotes -= 1;
            console.log(`Article upvotes decreased to: ${article.upvotes}`);
          } else if (article.voters[existingVoteIndex].vote === null) {
            console.log('User had no previous vote. Changing to upvote.');
            article.voters[existingVoteIndex].vote = 'upvote';
            article.upvotes += 1;
            console.log(`Article upvotes increased to: ${article.upvotes}`);
          } else if (article.voters[existingVoteIndex].vote === 'downvote') {
            console.log('User previously downvoted. Switching to upvote.');
            article.voters[existingVoteIndex].vote = 'upvote';
            article.downvotes -= 1;
            article.upvotes += 1;
            console.log(`Article downvotes decreased to: ${article.downvotes}`);
            console.log(`Article upvotes increased to: ${article.upvotes}`);
          }
        }
        break;
    
      case 'downvote':
        console.log(`Action: downvote, User ID: ${userId}`);
        if (!article.voters[existingVoteIndex]) {
          console.log('User has not voted yet. Adding new downvote.');
          article.voters.push({ voterId: userId, vote: 'downvote' });
          article.downvotes += 1;
          console.log(`Article downvotes increased to: ${article.downvotes}`);
        } else {
          if (article.voters[existingVoteIndex].vote === 'downvote') {
            console.log('User already downvoted. Resetting the vote.');
            article.voters[existingVoteIndex].vote = null;
            article.downvotes -= 1;
            console.log(`Article downvotes decreased to: ${article.downvotes}`);
          } else if (article.voters[existingVoteIndex].vote === null) {
            console.log('User had no previous vote. Changing to downvote.');
            article.voters[existingVoteIndex].vote = 'downvote';
            article.downvotes += 1;
            console.log(`Article downvotes increased to: ${article.downvotes}`);
          } else if (article.voters[existingVoteIndex].vote === 'upvote') {
            console.log('User previously upvoted. Switching to downvote.');
            article.voters[existingVoteIndex].vote = 'downvote';
            article.upvotes -= 1;
            article.downvotes += 1;
            console.log(`Article upvotes decreased to: ${article.upvotes}`);
            console.log(`Article downvotes increased to: ${article.downvotes}`);
          }
        }
        break;
    
      default:
        console.log(`Unknown action: ${action}`);
        break;
    }
    
    console.log("article.voters");
    console.log(article.voters);
    article.voters=[...article.voters];
    
    await this.articleModel.findByIdAndDelete(articleId);
    return await this.articleModel.create(article);
  }
  

  async changeImage(prod: Article, file: Express.Multer.File, index: number) {
    if (!prod.images || !prod.images[index]) {
      throw new NotFoundException(`Image with index ${index} is not found`);
    }
  
    // Encode the new image into Base64 format
    const encodedImage = file.buffer.toString('base64');
  
    // Replace the image at the given index in the `images` array
    prod.images[index] = encodedImage;
  
    // Save the updated article document to the database
    await this.articleModel.updateOne({ _id: prod.id }, { images: prod.images });
  
    console.log(`Image at index ${index} has been replaced successfully.`);
  }
  async deleteImage(article: Article, index: number) {
    // Check if the index is valid
    if (!article.images || !article.images[index]) {
      throw new NotFoundException(`Image with index ${index} is not found`);
    }
  
    // Remove the image at the specified index
    const updatedImages = article.images.filter((_, i) => i !== index);
  
    // Update the article document in the database
    await this.articleModel.findByIdAndUpdate(article.id, {
      images: updatedImages,
    });
  
    return { message: `Image at index ${index} deleted successfully` };
  }

  async findOneWithComments(id: string, withComments: string): Promise<CommentedArticle | Article> {
    const article = await this.articleModel.findById(id).lean().exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  
    // If withComments is true, fetch comments recursively
    if (withComments === "true") {
      const comments = await this.articleModel.find({ fatherId: id }).lean().exec();
      const commentedArticles: CommentedArticle[] = await Promise.all(
        comments.map(async (comment) => {
          const nestedComments = await this.findOneWithComments(comment.id, "true");
          //@ts-ignore
          return { ...comment, comments: nestedComments.comments };
        })
      );
      return { ...article, comments: commentedArticles };
    }
  
    return article; // Return article without comments
  }
  
  
  findArticlesOf(
    articles: Article[],
    fatherId: string | null,
    withComments: boolean
  ): Article[] | CommentedArticle[] {
    // Find articles with the given fatherId
    const filteredArticles = articles.filter((article) => article.fatherId === fatherId);
  
    // If withComments is true, recursively fetch comments for each article
    if (withComments) {
      return filteredArticles.map((article) => ({
        ...article,
        comments: this.findArticlesOf(articles, article.id, true), // Recursively build the tree
      }));
    }
  
    // If withComments is false, return articles without the comments attribute
    return filteredArticles;
  }

  async findAllCommented(){
    let res = (await this.articleModel.find().lean().exec()).map((doc) =>
      Article.fromDoc(doc),
    );
    return this.findArticlesOf(res,null,true);
  }

  async findOneCommented(id: string){
    let res = (await this.articleModel.find().lean().exec()).map((doc) =>
      Article.fromDoc(doc),
    );

    let comments =  this.findArticlesOf(res,id,true);
    let article = res.find(el=>el.id===id)
    if (!article)
      throw new NotFoundException("article not found")
    let commentedArticle : CommentedArticle = {...article,comments};
    return commentedArticle;

  }
  
  
}
