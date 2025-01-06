import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Validate } from "class-validator";
import { CustomValidator } from "src/validators/custom.validator";
import { UserRole } from "../models/user.model";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    readonly first_name: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    readonly last_name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'This is not an email' })
    @Validate(CustomValidator)
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8)
    readonly password: string;

    @IsOptional()
    @IsEnum(UserRole)
    readonly role?: UserRole;

    @IsNotEmpty()
    @IsPhoneNumber()
    readonly phone_number: string;

    @IsOptional()
    @IsString()
    readonly about_user?: string;
}