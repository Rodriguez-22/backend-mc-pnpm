import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './usuarios.service';
import { CreateUserDto } from '../../../../libs/common/src/dto/ms-usuarios/create-usuario.dto';
import { UpdateUserDto } from '../../../../libs/common/src/dto/ms-usuarios/update-usuario.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_user' })
  findOne(@Payload() id: string) { // ✅ Antes era number, ahora es string (UUID)
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  update(@Payload() data: { id: string; updateUserDto: UpdateUserDto }) { // ✅ id: string
    return this.usersService.update(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  remove(@Payload() id: string) { // ✅ id: string
    return this.usersService.remove(id);
  }
}