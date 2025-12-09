import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de que esta ruta sea correcta
import { CreateUserDto } from '../../../../libs/common/src/dto/ms-usuarios/create-usuario.dto';
import { UpdateUserDto } from '../../../../libs/common/src/dto/ms-usuarios/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, roleIds, ...userData } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          // 2. AQUÍ ESTÁ LA MAGIA QUE FALTABA:
          roles: roleIds && roleIds.length > 0 ? {
            connect: roleIds.map((id) => ({ id })) 
          } : undefined, 
        },
        include: {
          roles: true, // Para verlos en la respuesta
        },
      });

      const { password: _, ...result } = user;
      return result;

    } catch (error) {
      // Manejo de errores de Prisma (P2002 es violación de unique constraint)
      if (error.code === 'P2002') {
        throw new ConflictException('El email o nombre de usuario ya existe');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { isActive: true }, // Solo usuarios activos
      include: {
        roles: true, // Traer sus roles
      },
      orderBy: { createdAt: 'desc' }
    });

    // Limpiamos las contraseñas de la lista
    return users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { permisos: true } // Traemos roles y sus permisos
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...updateData } = updateUserDto;
    
    // Si viene password, hay que encriptarla de nuevo
    let dataToUpdate: any = { ...updateData };
    
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password: _, ...result } = updatedUser;
      return result;

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    // Soft Delete (recomendado): Marcar como inactivo en lugar de borrar
    /*
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
    */

    // Hard Delete (Borrado físico):
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }
}