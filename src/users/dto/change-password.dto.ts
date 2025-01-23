import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
