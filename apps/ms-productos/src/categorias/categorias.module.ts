import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categorias.controller';
import { CategoriesService } from './categorias.service';
import { Category } from '../../../../libs/common/src/entities/ms-productos/categoria.entity'; // Asegúrate de mover la entidad aquí

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Exportamos el servicio para usarlo en ProductsModule
})
export class CategoriesModule {}