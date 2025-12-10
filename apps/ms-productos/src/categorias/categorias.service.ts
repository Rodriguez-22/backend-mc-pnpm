import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto, Category } from '@app/common';

@Injectable()
export class CategoriasService implements OnModuleInit {
  private readonly logger = new Logger('CategoriasService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    this.logger.log('CategoriasService inicializado');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Ahora acepta el parámetro opcional
  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.categoryRepository.find({
      where,
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this.categoryRepository.merge(category, updateCategoryDto);
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    category.isActive = false; // Soft delete
    return await this.categoryRepository.save(category);
  }

  // --- MÉTODO QUE FALTABA ---

  async getMenu() {
    // Usamos QueryBuilder para filtrar productos inactivos dentro de categorías activas
    return this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product') // Carga productos
      .leftJoinAndSelect('product.allergens', 'allergens') // Carga alérgenos del producto
      .where('category.isActive = :active', { active: true })
      .andWhere('product.isActive = :active', { active: true }) // Solo productos activos
      .orderBy('category.name', 'ASC')
      .addOrderBy('product.name', 'ASC')
      .getMany();
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new Error('Ya existe una categoría con ese nombre');
    }
    this.logger.error(error);
    throw new Error('Error en BD Categorias');
  }
}