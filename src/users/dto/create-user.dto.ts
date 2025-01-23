import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  name: string;
  @IsOptional()
  lastName: string;
  @IsNotEmpty()
  @IsAlphanumeric()
  username : string 
  @IsOptional()
  bio;
}
