import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    SequelizeModule.forFeature([Category])
  ]
})
export class CategoryModule {}
