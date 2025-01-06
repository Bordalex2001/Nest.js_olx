import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/models/user.model';
import { Advert } from 'src/advert/models/advert.model';

@Injectable()
export class MessageService {
  private readonly logger: Logger = new Logger(MessageService.name);
    constructor(
      @InjectModel(Message) private readonly messageModel: typeof Message,
      @InjectModel(User) private readonly userModel: typeof User,
      @InjectModel(Advert) private readonly advertModel: typeof Advert
    ) {}

  async create(req: any, createMessageDto: CreateMessageDto) {
    const sender_id = (req.user as { user_id: string }).user_id;
    const { receiver_id, advert_id, content } = createMessageDto;
    
    const receiver = await this.userModel.findByPk(receiver_id);
    if (!receiver) {
      this.logger.error(`Receiver not found: ${receiver_id}`);
      throw new NotFoundException('Receiver not found');
    }

    const advert = await this.advertModel.findByPk(advert_id);
    if (!advert) {
      this.logger.error(`Advert not found: ${advert_id}`);
      throw new NotFoundException('Advert not found');
    }

    const message = this.messageModel.create({
      sender_id,
      receiver_id,
      advert_id,
      content
    });

    this.logger.log('Creating a new message');
    return { message: 'Message created successfully', data: message };
  }

  async findAll(req: any) {
    const user_id = (req.user as { user_id: string }).user_id;
    const { another_user_id, advert_id } = req.query;

    const messages = await this.messageModel.findAll({
      where: {
        sender_id: [user_id, another_user_id],
        receiver_id: [user_id, another_user_id],
        advert_id
      },
      order: [['created_at', 'ASC']]
    });

    this.logger.log('Fetching all messages');
    return messages;
  }

  async findOne(req: any, id: string) {
    const user_id = (req.user as { user_id: string }).user_id;
    const { another_user_id, advert_id } = req.query;

    const message = await this.messageModel.findOne({
      where: {
        id,
        sender_id: [user_id, another_user_id],
        receiver_id: [user_id, another_user_id],
        advert_id
      }
    });
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    this.logger.log(`Fetching message with id: ${id}`);
    return message;
  }

  async update(req: any, id: string, updateMessageDto: UpdateMessageDto) {
    const user_id = (req.user as { user_id: string }).user_id;
    const { another_user_id, advert_id } = req.query;

    const message = await this.messageModel.findOne({
      where: {
        id,
        sender_id: [user_id, another_user_id],
        receiver_id: [user_id, another_user_id],
        advert_id
      }
    });
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    await message.update(updateMessageDto);
    this.logger.log(`Updating message with id: ${id}`);
    return { message: 'Message updated successfully' };
  }

  async remove(req: any, id: string) {
    const user_id = (req.user as { user_id: string }).user_id;
    const { another_user_id, advert_id } = req.query;

    const message = await this.messageModel.findOne({
      where: {
        id,
        sender_id: [user_id, another_user_id],
        receiver_id: [user_id, another_user_id],
        advert_id
      }
    });
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    await message.destroy();
    this.logger.log(`Deleting message with id: ${id}`);
    return { message: 'Message deleted successfully' };
  }
}
