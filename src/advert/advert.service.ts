import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Advert } from './models/advert.model';
import { Category } from 'src/category/category.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdvertService {
  private readonly logger: Logger = new Logger(AdvertService.name);
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(Advert) private readonly advertModel: typeof Advert,
    @InjectModel(Category) private readonly categoryModel: typeof Category
  ) {}

  async create(createAdvertDto: CreateAdvertDto, user_id: string): Promise<any> {
    const advert = await this.advertModel.create({ ...createAdvertDto, user_id });

    const category = await this.categoryModel.findByPk(createAdvertDto.category_id);
    if (!category) {
      this.logger.error(`Category not found: ${createAdvertDto.category_id}`);
      throw new NotFoundException('Category not found');
    }

    this.logger.log('Creating a new advert');
    return { message: 'Advert created successfully', advert };
  }

  async findAll() {
    const cached_adverts = await this.cacheManager.get('adverts');
    if (cached_adverts) {
      this.logger.log('Fetching all adverts from cache');
      return cached_adverts;
    }

    const adverts = await this.advertModel.findAll();
    await this.cacheManager.set('adverts', adverts, 600000);
    this.logger.log('Fetching all adverts');
    return adverts;
  }

  async findOne(id: string) {
    const cached_advert = await this.cacheManager.get(`advert:${id}`);
    if (cached_advert) {
        this.logger.log(`Fetching advert with id: ${id} from cache`);
        return cached_advert as Advert;
    }

    const advert = await this.advertModel.findByPk(id);
    if (!advert) {
        this.logger.error(`Advert not found: ${id}`);
        throw new NotFoundException('Advert not found');
    }
    await this.cacheManager.set(`advert:${id}`, advert, 600000);
    this.logger.log(`Fetching advert with id: ${id}`);
    return advert;
  }

  async update(id: string, updateAdvertDto: UpdateAdvertDto, user_id: string) {
    const advert = await this.findOne(id);

    if (advert.user_id !== user_id) {
        this.logger.error(`You are not the owner of this advert: ${id}`);
        throw new ForbiddenException('You are not the owner of this advert');
    }

    await advert.update(updateAdvertDto);
    this.logger.log(`Updating advert with id: ${id}`);
    return { message: 'Advert updated successfully' };
  }

  async remove(id: string, user_id: string) {
    const advert = await this.findOne(id);

    if (advert.user_id !== user_id) {
        this.logger.error(`You are not the owner of this advert: ${id}`);
        throw new ForbiddenException('You are not the owner of this advert');
    }

    await advert.destroy();
    this.logger.log(`Deleting advert with id: ${id}`);
    return { message: 'Advert deleted successfully' };
  }
}