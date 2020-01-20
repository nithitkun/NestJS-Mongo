import { ILogin } from "interfaces/app.interface";
import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginModel implements ILogin {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    remember: boolean;

}