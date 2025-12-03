// src/modulos/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from '../../../../libs/common/src/entities/ms-usuarios/ms-roles/role.entity';
import { Permiso } from '../../../../libs/common/src/entities/ms-usuarios/ms-permisos/permiso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permiso])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}