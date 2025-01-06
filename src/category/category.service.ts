import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    const { name, parent_category_id } = createCategoryDto;
    const category = await this.categoryModel.create({
      name,
      parent_category_id,
    });

    this.logger.log('Creating a new category');
    return { message: 'Category created successfully', category };
  }

  async findAll() {
    const categories = await this.categoryModel.findAll();
    this.logger.log('Fetching all categories');
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      this.logger.error(`Category not found: ${id}`);
      throw new NotFoundException('Category not found');
    }
    this.logger.log(`Fetching category with id: ${id}`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      this.logger.error(`Category not found: ${id}`);
      throw new NotFoundException('Category not found');
    }

    await category.update(updateCategoryDto);
    this.logger.log(`Updating category with id: ${id}`);
    return { message: 'Category updated successfully' };
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      this.logger.error(`Category not found: ${id}`);
      throw new NotFoundException('Category not found');
    }

    await category.destroy();
    this.logger.log(`Deleting category with id: ${id}`);
    return { message: 'Category deleted successfully' };
  }
}
