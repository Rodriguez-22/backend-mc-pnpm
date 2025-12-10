import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
// Si vas a crear un módulo para alérgenos, impórtalo aquí también
import { AlergenosModule } from './alergenos/alergenos.module';

import { Product, Category, Allergen } from '@app/common'; // Importamos desde la lib

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-productos/.env', // Ruta relativa desde la raíz
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo (crea tablas automáticamente)
      entities: [Product, Category, Allergen], // Las registramos explícitamente
    }),
    ProductosModule,
    CategoriasModule,
    AlergenosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}