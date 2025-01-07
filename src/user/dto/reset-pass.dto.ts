import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPassDto {
    @IsNotEmpty()
    @IsString()
    readonly reset_token: string;

    @IsNotEmpty()
    @IsString()
    @Length(8)
    readonly new_password: string;
}