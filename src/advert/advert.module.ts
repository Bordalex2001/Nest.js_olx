import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Advert } from './models/advert.model';
import { AdvertImage } from './models/advert-image.model';
import { Category } from 'src/category/category.model';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdvertController],
  providers: [AdvertService, JwtService],
  imports: [
    SequelizeModule.forFeature([Advert, AdvertImage, Category]),
    CacheModule.register(),
  ],
})
export class AdvertModule {}
