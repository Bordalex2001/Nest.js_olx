import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { User } from 'src/user/models/user.model';
import { Advert } from 'src/advert/models/advert.model';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MessageController],
  providers: [MessageService, JwtService],
  imports: [
    SequelizeModule.forFeature([Message, User, Advert]),
    CacheModule.register(),
  ]
})
export class MessageModule {}
