import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginCredentialsDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password : string ;
    
}