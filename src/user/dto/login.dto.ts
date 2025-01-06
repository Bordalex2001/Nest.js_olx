import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'This is not an email' })
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}