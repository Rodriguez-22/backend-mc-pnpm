import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Inyección global
import { CreateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permisoIds, name } = createRoleDto;
    
    // Generar slug (Ej: "Jefe de Cocina" -> "jefe_de_cocina")
    const slug = name.toLowerCase().replace(/ /g, '_');

    return this.prisma.role.create({
      data: {
        name,
        slug,
        // Conectar permisos si vienen en el DTO
        permisos: permisoIds ? {
          connect: permisoIds.map((id) => ({ id }))
        } : undefined
      },
      include: { permisos: true }
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: { permisos: true }
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permisos: true }
    });
    if (!role) throw new NotFoundException(`Rol ${id} no encontrado`);
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { permisoIds, ...data } = updateRoleDto;

    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        // Actualizar relaciones de permisos
        permisos: permisoIds ? {
          set: permisoIds.map((pid) => ({ id: pid })) // 'set' reemplaza todos los anteriores
        } : undefined
      },
      include: { permisos: true }
    });
  }

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}