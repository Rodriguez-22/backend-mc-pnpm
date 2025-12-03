// src/modulos/permisos/permisos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { Permiso } from '../../../../libs/common/src/entities/ms-usuarios/ms-permisos/permiso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permiso])],
  controllers: [PermisosController],
  providers: [PermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}