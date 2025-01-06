import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertDto } from './create-advert.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AdvertStatus } from '../models/advert.model';

export class UpdateAdvertDto extends PartialType(CreateAdvertDto) 
{
    @IsOptional()
    @IsEnum(AdvertStatus)
    readonly status?: AdvertStatus;
}