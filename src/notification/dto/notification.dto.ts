import {IsBoolean, IsMongoId, IsOptional, IsString} from 'class-validator';

export class NotificationDto {

  /***
   * 
   * { "message":"firstNotif","is_read":false,"receiverId":"679a3bf770166c0c2314f101",senderId:"679a3bf770166c0c2314f101","articleId","679a6272df7434762deb6957"}
   */
  @IsString()
  message: string;

  @IsBoolean()
  is_read: boolean;

  @IsMongoId()
  senderId: any;

  @IsMongoId()
  receiverId: any;

  @IsMongoId()
  articleId: any;
  
  @IsOptional()
  @IsString()
  url;
}
