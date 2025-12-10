import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AlergenosModule } from './alergenos/alergenos.module'; // 👈 Descomenta cuando crees el módulo

// Importamos las entidades directamente (ajusta la ruta si es necesario)
import { Product } from '../../../libs/common/src/entities/ms-productos/productos.entity';
import { Category } from '../../../libs/common/src/entities/ms-productos/categoria.entity';
import { Allergen } from '../../../libs/common/src/entities/ms-productos/alergeno.entity';

@Module({
  imports: [
    // 1. Cargar variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-productos/.env', // Ruta importante
    }),

    // 2. Configurar TypeORM (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // ✅ Crea las tablas automáticamente (solo dev)
      entities: [Product, Category, Allergen],
    }),

    ProductosModule,
    CategoriasModule,
    AlergenosModule, // 👈 Añade esto
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}