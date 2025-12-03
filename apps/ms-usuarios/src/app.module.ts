import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';

@Module({
  imports: [RolesModule, PermisosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
