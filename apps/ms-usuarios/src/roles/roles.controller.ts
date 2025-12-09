import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/create-role.dto';
import { UpdateRoleDto } from '../../../../libs/common/src/dto/ms-usuarios/ms-roles/update-role.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'createRole' }) // ✅ CAMBIO AQUÍ
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern({ cmd: 'findAllRoles' }) // ✅ CAMBIO AQUÍ
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern({ cmd: 'findOneRole' }) // ✅ CAMBIO AQUÍ
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateRole' }) // ✅ CAMBIO AQUÍ
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto.id, updateRoleDto);
  }

  @MessagePattern({ cmd: 'removeRole' }) // ✅ CAMBIO AQUÍ
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}