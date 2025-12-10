import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { CreateProductDto, UpdateProductDto, Product, Category, Allergen } from '@app/common';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Allergen)
    private readonly allergenRepository: Repository<Allergen>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, allergenIds, ...productDetails } = createProductDto;

    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
    }

    let allergens: Allergen[] = [];
    if (allergenIds && allergenIds.length > 0) {
      allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
    }

    try {
      const product = this.productRepository.create({
        ...productDetails,
        category,
        allergens,
      });
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.productRepository.find({
      where,
      relations: ['category', 'allergens'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'allergens'],
    });
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, allergenIds, ...toUpdate } = updateProductDto;

    const product = await this.findOne(id); // Reusa findOne para cargar relaciones

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) throw new NotFoundException(`Categoría ${categoryId} no encontrada`);
      product.category = category;
    }

    if (allergenIds) {
      const allergens = await this.allergenRepository.findBy({ id: In(allergenIds) });
      product.allergens = allergens;
    }

    this.productRepository.merge(product, toUpdate);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isActive = false; // Soft Delete
    return await this.productRepository.save(product);
  }

  // --- MÉTODOS QUE FALTABAN ---

  async findAvailable() {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category', 'allergens'],
    });
  }

  async search(query: string) {
    // Busca coincidencias en nombre O descripción (case insensitive)
    return this.productRepository.find({
      where: [
        { name: ILike(`%${query}%`), isActive: true },
        { description: ILike(`%${query}%`), isActive: true },
      ],
      relations: ['category', 'allergens'],
    });
  }

  async toggleAvailability(id: string) {
    const product = await this.findOne(id);
    product.isActive = !product.isActive;
    return await this.productRepository.save(product);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new Error('Error al gestionar productos. Revisa los logs.');
  }
}