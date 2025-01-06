import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPassDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'This is not an email' })
    readonly email: string;
}