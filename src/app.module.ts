import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { AdvertModule } from './advert/advert.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE,
      autoLoadModels: true,
      synchronize: true,
      //sync: { alter: true }
    }),
    AuthModule,
    MessageModule,
    AdvertModule,
    CategoryModule
  ]
})
export class AppModule {}
