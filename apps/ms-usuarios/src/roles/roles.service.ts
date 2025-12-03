// src/modulos/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../../../libs/common/src/entities/ms-usuarios/ms-roles/role.entity';
import { Permiso } from '../../../../libs/common/src/entities/ms-usuarios/ms-permisos/permiso.entity';
import { CreateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permisoIds, ...roleData } = createRoleDto;

    const slug = createRoleDto.name.toUpperCase().replace(/\s+/g, '_');

    let permisos: Permiso[] = [];
    if (permisoIds && permisoIds.length > 0) {
      permisos = await this.permisoRepository.findBy({ id: In(permisoIds) });
    }

    const role = this.roleRepository.create({
      ...roleData,
      slug,
      permisos,
    });

    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permisos'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permisos'],
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    const { permisoIds, ...updateData } = updateRoleDto;

    if (permisoIds) {
      const permisos = await this.permisoRepository.findBy({ id: In(permisoIds) });
      role.permisos = permisos;
    }

    Object.assign(role, updateData);
    return await this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
}