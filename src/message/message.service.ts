import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/models/user.model';
import { Advert } from 'src/advert/models/advert.model';
import { Op } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MessageService {
  private readonly logger: Logger = new Logger(MessageService.name);
    constructor(
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      @InjectModel(Message) private readonly messageModel: typeof Message,
      @InjectModel(User) private readonly userModel: typeof User,
      @InjectModel(Advert) private readonly advertModel: typeof Advert
    ) {}

  async create(createMessageDto: CreateMessageDto, user_id: string) {
    const message = await this.messageModel.create({ ...createMessageDto, user_id });

    const receiver = await this.userModel.findByPk(createMessageDto.receiver_id);
    if (!receiver) {
      this.logger.error(`Receiver not found: ${createMessageDto.receiver_id}`);
      throw new NotFoundException('Receiver not found');
    }

    const advert = await this.advertModel.findByPk(createMessageDto.advert_id);
    if (!advert) {
      this.logger.error(`Advert not found: ${createMessageDto.advert_id}`);
      throw new NotFoundException('Advert not found');
    }

    this.logger.log('Creating a new message');
    return { message: 'Message created successfully', data: message };
  }

  async findAllByAdvert(user1_id: string, user2_id: string, advert_id: string) {
    const cached_messages = await this.cacheManager.get('messages');
    if (cached_messages) {
      this.logger.log('Fetching all messages from cache');
      return cached_messages;
    }

    const messages = await this.messageModel.findAll({
      where: {
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id }
        ],
        advert_id
      },
      order: [['created_at', 'ASC']]
    });
    await this.cacheManager.set('messages', messages, 600000);
    this.logger.log('Fetching all messages');
    return messages;
  }

  async findOneByAdvert(id: string, user1_id: string, user2_id: string, advert_id: string) {
    const cached_message = await this.cacheManager.get(`message:${id}`);
    if (cached_message) {
      this.logger.log(`Fetching message with id: ${id} from cache`);
      return cached_message as Message;
    }
    
    const message = await this.messageModel.findOne({
      where: {
        id,
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id }
        ],
        advert_id
      }
    });
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }
    await this.cacheManager.set(`message:${id}`, message, 600000);
    this.logger.log(`Fetching message with id: ${id}`);
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, user_id: string) {
    const message = await this.messageModel.findByPk(id);
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== user_id) {
      this.logger.error(`You are not the sender of this message: ${id}`);
      throw new ForbiddenException('You are not the sender of this message');
    }

    await message.update(updateMessageDto);
    this.logger.log(`Updating message with id: ${id}`);
    return { message: 'Message updated successfully' };
  }

  async remove(id: string, user_id: string) {
    const message = await this.messageModel.findByPk(id);
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== user_id || message.receiver_id !== user_id) {
      this.logger.error(`You are not the sender or receiver of this message: ${id}`);
      throw new ForbiddenException('You are not the sender or receiver of this message');
    }

    await message.destroy();
    this.logger.log(`Deleting message with id: ${id}`);
    return { message: 'Message deleted successfully' };
  }

  async markAsRead(id: string) {
    const message = await this.messageModel.findByPk(id);
    if (!message) {
      this.logger.error(`Message not found: ${id}`);
      throw new NotFoundException('Message not found');
    }

    await message.update({ is_read: true });
    this.logger.log(`Marking message with id: ${id} as read`);
    return { message: 'Message marked as read' };
  }
}
