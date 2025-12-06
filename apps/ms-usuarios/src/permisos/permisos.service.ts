import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermisoDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-permisos/update.permiso.dto';

@Injectable()
export class PermisosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermisoDto: CreatePermisoDto) {
    // Slug autogenerado: "resource:action" (ej: "users:create")
    const slug = `${createPermisoDto.resource}:${createPermisoDto.action}`.toLowerCase();

    return this.prisma.permiso.create({
      data: {
        ...createPermisoDto,
        slug
      }
    });
  }

  async findAll() {
    return this.prisma.permiso.findMany();
  }

  async findOne(id: string) {
    const permiso = await this.prisma.permiso.findUnique({ where: { id } });
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return permiso;
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto) {
    return this.prisma.permiso.update({
      where: { id },
      data: updatePermisoDto
    });
  }

  async remove(id: string) {
    return this.prisma.permiso.delete({ where: { id } });
  }
}