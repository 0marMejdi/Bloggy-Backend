import { IsEmail, IsNotEmpty } from "class-validator";

export class ReturnUserDto {

@IsNotEmpty()
@IsEmail()
email: string;
}
