import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Advert } from './models/advert.model';
import { AdvertImage } from './models/advert-image.model';
import { Category } from 'src/category/category.model';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [AdvertController],
  providers: [AdvertService],
  imports: [
    SequelizeModule.forFeature([Advert, AdvertImage, Category]),
    CategoryModule
  ]
})
export class AdvertModule {}
