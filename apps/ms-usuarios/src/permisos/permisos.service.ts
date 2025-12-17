import { Injectable, NotFoundException } from '@nestjs/common';
// Importamos el servicio de Prisma (nuestra herramienta para hablar con la Base de Datos)
import { PrismaService } from '../prisma/prisma.service';
// Importamos los formularios de datos (DTOs)
import { CreatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '@app/common/dto/ms-usuarios/ms-permisos/update.permiso.dto';

@Injectable() // Marca esta clase como un "Servicio" útil que otros pueden usar.
export class PermisosService {
  
  // 1. CONSTRUCTOR
  // Aquí "inyectamos" a Prisma.
  // Es como si el cerrajero abriera su caja de herramientas antes de empezar a trabajar.
  constructor(private readonly prisma: PrismaService) {}

  // 2. CREAR PERMISO
  async create(createPermisoDto: CreatePermisoDto) {
    // --- LÓGICA DE NEGOCIO ---
    // Aquí hacemos algo inteligente antes de guardar: generamos un "Slug" automático.
    // Un Slug es un identificador legible para máquinas.
    // Si resource="users" y action="create", el slug será "users:create".
    const slug = `${createPermisoDto.resource}:${createPermisoDto.action}`.toLowerCase();

    // Guardamos en la base de datos usando Prisma.
    return this.prisma.permiso.create({
      data: {
        ...createPermisoDto, // Copia todos los datos que vinieron (nombre, descripción...)
        slug // Añade el slug que acabamos de inventar
      }
    });
  }

  // 3. LISTAR TODOS
  async findAll() {
    // Prisma: "Dame todos los registros de la tabla 'permiso'".
    return this.prisma.permiso.findMany();
  }

  // 4. BUSCAR UNO
  async findOne(id: string) {
    // Buscamos un permiso que tenga ese ID exacto.
    const permiso = await this.prisma.permiso.findUnique({ where: { id } });
    
    // Si no existe, lanzamos un error (404) para avisar al usuario.
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    
    return permiso;
  }

  // 5. ACTUALIZAR
  async update(id: string, updatePermisoDto: UpdatePermisoDto) {
    // Prisma: "Busca el permiso con este ID y actualiza sus datos con lo que te paso".
    return this.prisma.permiso.update({
      where: { id },
      data: updatePermisoDto
    });
  }

  // 6. BORRAR (HARD DELETE)
  async remove(id: string) {
    // ¡OJO! Aquí estás usando .delete().
    // Esto significa que el permiso se BORRA DE VERDAD de la base de datos.
    // Es diferente al "Soft Delete" (isActive = false) que vimos en otros sitios.
    // Si borras un permiso que un Rol está usando, podrías tener problemas (depende de tu configuración de BD).
    return this.prisma.permiso.delete({ where: { id } });
  }
}