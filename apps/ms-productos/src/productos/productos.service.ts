import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../../libs/common/src/entities/ms-productos/productos.entity';
import { CreateProductDto } from '../../../../libs/common/src/dto/ms-productos/productos/create-productos.dto'
import { UpdateProductDto } from '../../../../libs/common/src/dto/ms-productos/productos/update-productos.dto';
import { CategoriesService } from '../categorias/categorias.service'; // Servicio inyectado

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService, // Inyección del servicio de categorías
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;
    
    // Usamos el servicio de categorías para validar
    const category = await this.categoriesService.findOne(categoryId);

    const product = this.productRepository.create({
      ...productData,
      category,
    });

    return await this.productRepository.save(product);
  }

  async findAll(includeInactive = false): Promise<Product[]> {
    const where = includeInactive ? {} : { isActive: true };
    return await this.productRepository.find({
      where,
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findAvailable(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isActive: true, isAvailable: true },
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        category: { id: categoryId },
        isActive: true,
        isAvailable: true,
      },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, ...productData } = updateProductDto;

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);
      product.category = category;
    }

    Object.assign(product, productData);
    return await this.productRepository.save(product);
  }

  async toggleAvailability(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.isAvailable = !product.isAvailable;
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async search(query: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere(
        '(LOWER(product.name) LIKE LOWER(:query) OR LOWER(product.description) LIKE LOWER(:query))',
        { query: `%${query}%` },
      )
      .orderBy('product.name', 'ASC')
      .getMany();
  }
}