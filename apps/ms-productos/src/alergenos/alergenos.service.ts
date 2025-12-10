import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlergenoDto, UpdateAlergenoDto, Allergen } from '@app/common';

@Injectable()
export class AlergenosService {
  private readonly logger = new Logger('AlergenosService');

  constructor(
    @InjectRepository(Allergen)
    private readonly allergenRepository: Repository<Allergen>,
  ) {}

  async create(createAlergenoDto: CreateAlergenoDto) {
    try {
      const allergen = this.allergenRepository.create(createAlergenoDto);
      return await this.allergenRepository.save(allergen);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error al crear el alérgeno');
    }
  }

  async findAll() {
    return this.allergenRepository.find();
  }

  async findOne(id: string) {
    const allergen = await this.allergenRepository.findOneBy({ id });
    if (!allergen) {
      throw new NotFoundException(`Alérgeno con ID ${id} no encontrado`);
    }
    return allergen;
  }

  async update(id: string, updateAlergenoDto: UpdateAlergenoDto) {
    const allergen = await this.findOne(id); // Verifica si existe
    this.allergenRepository.merge(allergen, updateAlergenoDto);
    return await this.allergenRepository.save(allergen);
  }

  async remove(id: string) {
    const allergen = await this.findOne(id);
    return await this.allergenRepository.remove(allergen);
  }
}