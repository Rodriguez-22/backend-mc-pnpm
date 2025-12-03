import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../../../../libs/common/src/dto/ms-roles/create-role.dto';
import { UpdateRoleDto } from '../../../../libs/common/src/dto/ms-roles/update-role.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('createRole')
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern('findAllRoles')
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern('findOneRole')
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern('updateRole')
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto.id, updateRoleDto);
  }

  @MessagePattern('removeRole')
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}