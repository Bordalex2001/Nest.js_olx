import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name);
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(Category) private readonly categoryModel: typeof Category
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    const category = await this.categoryModel.create({ ...createCategoryDto });

    this.logger.log('Creating a new category');
    return { message: 'Category created successfully', category };
  }

  async findAll() {
    const cached_categories = await this.cacheManager.get('categories');
    if (cached_categories) {
      this.logger.log('Fetching all categories from cache');
      return cached_categories;
    }
    
    const categories = await this.categoryModel.findAll();
    await this.cacheManager.set('categories', categories, 3600000);
    this.logger.log('Fetching all categories');
    return categories;
  }

  async findOne(id: string) {
    const cached_category = await this.cacheManager.get(`category:${id}`);
    if (cached_category) {
      this.logger.log(`Fetching category with id: ${id} from cache`);
      return cached_category as Category;
    }
    
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      this.logger.error(`Category not found: ${id}`);
      throw new NotFoundException('Category not found');
    }
    await this.cacheManager.set(`category:${id}`, category, 3600000);
    this.logger.log(`Fetching category with id: ${id}`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    await category.update(updateCategoryDto);
    this.logger.log(`Updating category with id: ${id}`);
    return { message: 'Category updated successfully' };
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await category.destroy();
    this.logger.log(`Deleting category with id: ${id}`);
    return { message: 'Category deleted successfully' };
  }
}
