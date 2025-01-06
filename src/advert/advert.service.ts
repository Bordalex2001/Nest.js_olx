import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Advert } from './models/advert.model';
import { Category } from 'src/category/category.model';

@Injectable()
export class AdvertService {
  private readonly logger: Logger = new Logger(AdvertService.name);
  constructor(
    @InjectModel(Advert) private readonly advertModel: typeof Advert,
    @InjectModel(Category) private readonly categoryModel: typeof Category
  ) {}

  async create(req: any, createAdvertDto: CreateAdvertDto): Promise<any> {
    const user_id = (req.user as { user_id: string }).user_id;
    const { title, description, category_id, price, location } = createAdvertDto;
    //const files = req.files as Express.Multer.File[];
    const category = await this.categoryModel.findByPk(category_id);
    if (!category) {
        this.logger.error(`Category not found: ${category_id}`);
        throw new NotFoundException('Category not found');
    }
    const advert = await this.advertModel.create({
        user_id,
        title,
        description,
        category_id,
        price,
        location,
    });
    /*if (files) {
        const imagePaths = files.map((file) => ({
            advertId: advert.id,
            imagePath: file.path,
        }));
        await AdvertImage.bulkCreate(imagePaths);
    }*/

    this.logger.log('Creating a new advert');
    return { message: 'Advert created successfully', advert };
  }

  async findAll() {
    const adverts = await this.advertModel.findAll();
    this.logger.log('Fetching all adverts');
    return adverts;
  }

  async findOne(id: string) {
    const advert = await this.advertModel.findByPk(id);
    if (!advert) {
        this.logger.error(`Advert not found: ${id}`);
        throw new NotFoundException('Advert not found');
    }
    this.logger.log(`Fetching advert with id: ${id}`);
    return advert;
  }

  async update(req: any, id: string, updateAdvertDto: UpdateAdvertDto) {
    const user_id = (req.user as { user_id: string }).user_id;
    const advert = await this.advertModel.findByPk(id);
    if (!advert) {
        this.logger.error(`Advert not found: ${id}`);
        throw new NotFoundException('Advert not found');
    }

    if (advert.user_id !== user_id) {
        this.logger.error(`Unauthorized update attempt: ${id}`);
        throw new UnauthorizedException('Unauthorized update attempt');
    }
    await advert.update(updateAdvertDto);
    this.logger.log(`Updating advert with id: ${id}`);
    return { message: 'Advert updated successfully' };
  }

  async remove(req: any, id: string) {
    const user_id = (req.user as { user_id: string }).user_id;
    const advert = await this.advertModel.findByPk(id);
    if (!advert) {
        this.logger.error(`Advert not found: ${id}`);
        throw new NotFoundException('Advert not found');
    }

    if (advert.user_id !== user_id) {
        this.logger.error(`Unauthorized delete attempt: ${id}`);
        throw new UnauthorizedException('Unauthorized delete attempt');
    }
    await advert.destroy();
    this.logger.log(`Deleting advert with id: ${id}`);
    return { message: 'Advert deleted successfully' };
  }
}
