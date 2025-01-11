import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('advert')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Roles('admin', 'seller')
  create(@Body() createAdvertDto: CreateAdvertDto, @Request() req: any) {
    return this.advertService.create(createAdvertDto, req.user.id);
  }

  @Get()
  @Roles('admin', 'seller', 'buyer', 'guest')
  findAll() {
    return this.advertService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'seller', 'buyer', 'guest')
  findOne(@Param('id') id: string) {
    return this.advertService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updateAdvertDto: UpdateAdvertDto, @Request() req: any) {
    return this.advertService.update(id, updateAdvertDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.advertService.remove(id, req.user.id);
  }
}
