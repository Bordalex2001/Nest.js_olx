import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Advert } from './models/advert.model';
import { AdvertImage } from './models/advert-image.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Advert, AdvertImage])
    ]
})
export class AdvertModule {}
