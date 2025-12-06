import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';

@Module({
  imports: [RolesModule, PermisosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
