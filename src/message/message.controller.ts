import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() req: any, createMessageDto: CreateMessageDto) {
    return this.messageService.create(req, createMessageDto);
  }

  @Get()
  findAll(@Body() req: any) {
    return this.messageService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body() req: any) {
    return this.messageService.findOne(req, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() req: any, updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(req, id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() req: any) {
    return this.messageService.remove(req, id);
  }
}
