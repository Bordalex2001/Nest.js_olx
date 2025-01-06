import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';

@Controller('advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() req: any, createAdvertDto: CreateAdvertDto) {
    return this.advertService.create(req, createAdvertDto);
  }

  @Get()
  findAll() {
    return this.advertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(@Param('id') id: string, @Body() req: any, updateAdvertDto: UpdateAdvertDto) {
    return this.advertService.update(req, id, updateAdvertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() req: any) {
    return this.advertService.remove(req, id);
  }
}
