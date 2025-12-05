import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importa tu servicio
import { CreateUserDto } from '@app/common'; // Tus DTOs compartidos
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Aquí asignamos roles. Podrías recibir los IDs de roles en el DTO
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        // Ejemplo: Asignar rol por defecto o el que venga en el DTO
        roles: {
          connect: { slug: 'waiter' } // Conectar por slug existente
        }
      },
      include: { roles: true } // Para devolver el usuario con sus roles
    });
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: { permisos: true } // Traemos roles y sus permisos
        }
      }
    });
  }
  
  // ... resto de métodos (update, delete)
}