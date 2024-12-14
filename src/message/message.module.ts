import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Message])
    ]
})
export class MessageModule {}
