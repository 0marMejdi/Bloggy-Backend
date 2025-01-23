import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  fatherId: string; // Parent article or thread ID

  @IsString()
  @IsOptional()
  slug?: string;

}

