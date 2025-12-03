import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../../libs/common/src/entities/ms-productos/categoria.entity';
import { CreateCategoryDto } from '../../../../libs/common/src/dto/ms-productos/categorias/create-categoria.dto';
import { UpdateCategoryDto } from '../../../../libs/common/src/dto/ms-productos/categorias/update-categoria.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
    const existing = await this.categoryRepository.findOne({ where: { name } });
    if (existing) throw new ConflictException(`La categoría "${name}" ya existe`);
    
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(includeInactive = false): Promise<Category[]> {
    const where = includeInactive ? {} : { isActive: true };
    return await this.categoryRepository.find({
      where,
      relations: ['products'],
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name } });
      if (existing) throw new ConflictException(`La categoría "${updateCategoryDto.name}" ya existe`);
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    if (category.products && category.products.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con productos asociados');
    }
    await this.categoryRepository.remove(category);
  }

  // El menú es fundamentalmente una lista de categorías con sus productos
  async getMenu(): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .where('category.isActive = :isActive', { isActive: true })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .andWhere('product.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy('category.order', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .addOrderBy('product.name', 'ASC')
      .getMany();
  }
}