import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { User } from 'src/user/models/user.model';
import { Advert } from 'src/advert/models/advert.model';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    SequelizeModule.forFeature([Message, User, Advert]),
    UserModule
  ]
})
export class MessageModule {}
