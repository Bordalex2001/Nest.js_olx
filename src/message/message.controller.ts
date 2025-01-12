import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('message')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Roles('admin', 'seller', 'buyer')
  create(@Body() createMessageDto: CreateMessageDto, @Param('user_id') user_id: string) {
    return this.messageService.create(createMessageDto, user_id);
  }

  @Get(':advert_id/:user1_id/:user2_id')
  @Roles('admin', 'seller', 'buyer')
  findAllByAdvert(
    @Param('user1_id') user1_id: string, 
    @Param('user2_id') user2_id: string, 
    @Param('advert_id') advert_id: string) {
    return this.messageService.findAllByAdvert(user1_id, user2_id, advert_id);
  }

  @Get(':id/:advert_id/:user1_id/:user2_id')
  @Roles('admin', 'seller', 'buyer')
  findOneByAdvert(
    @Param('id') id: string,
    @Param('user1_id') user1_id: string,
    @Param('user2_id') user2_id: string,
    @Param('advert_id') advert_id: string) {
    return this.messageService.findOneByAdvert(id, user1_id, user2_id, advert_id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  @Roles('admin', 'seller', 'buyer')
  update(
    @Param('id') id: string, 
    @Param('user_id') user_id: string,
    @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto, user_id);
  }

  @Delete(':id')
  @Roles('admin', 'seller', 'buyer')
  remove(
    @Param('id') id: string,
    @Param('user_id') user_id: string) {
    return this.messageService.remove(id, user_id);
  }

  @Patch(':id/read')
  @Roles('admin', 'seller', 'buyer')
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(id);
  }
}