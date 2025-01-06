import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Min } from "class-validator";

export class CreateAdvertDto
{
    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 1000)
    readonly description: string;

    @IsNotEmpty()
    @Min(0)
    readonly price: number;

    @IsNotEmpty()
    @IsUUID()
    readonly category_id: string;

    @IsOptional()
    @IsString()
    readonly location?: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    readonly images: string[];
}