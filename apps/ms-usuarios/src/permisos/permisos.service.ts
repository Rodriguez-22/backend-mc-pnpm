// src/modulos/permisos/permisos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../../../../libs/common/src/entities/ms-permisos/permiso.entity';
import { CreatePermisoDto } from '../../../../libs/common/src/dto/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '../../../../libs/common/src/dto/ms-permisos/update.permiso.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    const slug = `${createPermisoDto.resource}:${createPermisoDto.action}`;

    const permiso = this.permisoRepository.create({
      ...createPermisoDto,
      slug,
    });

    return await this.permisoRepository.save(permiso);
  }

  async findAll(): Promise<Permiso[]> {
    return await this.permisoRepository.find();
  }

  async findOne(id: string): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({ where: { id } });

    if (!permiso) {
      throw new NotFoundException('Permiso no encontrado');
    }

    return permiso;
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto): Promise<Permiso> {
  const permiso = await this.findOne(id);
  Object.assign(permiso, updatePermisoDto);
  return await this.permisoRepository.save(permiso);
}

async remove(id: string): Promise<void> {
  const permiso = await this.findOne(id); // Esto lanza NotFoundException si no existe
  await this.permisoRepository.delete(id);
}
}