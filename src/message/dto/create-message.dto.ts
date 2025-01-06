import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateMessageDto 
{
    @IsNotEmpty()
    @IsUUID()
    readonly sender_id: string;

    @IsNotEmpty()
    @IsUUID()
    readonly receiver_id: string;

    @IsNotEmpty()
    @IsUUID()
    readonly advert_id: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    readonly content: string;
}