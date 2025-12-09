import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-permisos/create-permiso.dto';
import { UpdatePermisoDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-permisos/update.permiso.dto';

@Controller()
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @MessagePattern({ cmd: 'createPermiso' }) // ✅ CAMBIO AQUÍ
  create(@Payload() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @MessagePattern({ cmd: 'findAllPermisos' }) // ✅ CAMBIO AQUÍ
  findAll() {
    return this.permisosService.findAll();
  }

  @MessagePattern({ cmd: 'findOnePermiso' }) // ✅ CAMBIO AQUÍ
  findOne(@Payload() id: string) {
    return this.permisosService.findOne(id);
  }

  @MessagePattern({ cmd: 'updatePermiso' }) // ✅ CAMBIO AQUÍ
  update(@Payload() updatePermisoDto: UpdatePermisoDto) {
    return this.permisosService.update(updatePermisoDto.id, updatePermisoDto);
  }

  @MessagePattern({ cmd: 'removePermiso' }) // ✅ CAMBIO AQUÍ
  remove(@Payload() id: string) {
    return this.permisosService.remove(id);
  }
}