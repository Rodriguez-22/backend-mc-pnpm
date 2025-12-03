import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './productos.controller';
import { ProductsService } from './productos.service';
import { Product } from '../../../../libs/common/src/entities/ms-productos/productos.entity';
import { CategoriesModule } from '../categorias/categorias.module'; // Importante

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), 
    CategoriesModule // Importamos para usar CategoriesService
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}