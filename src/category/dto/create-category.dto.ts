import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateCategoryDto 
{
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    readonly name: string;

    @IsNotEmpty()
    @IsUUID()
    readonly parent_category_id?: string;
}