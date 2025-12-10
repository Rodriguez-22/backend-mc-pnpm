import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlergenosService } from './alergenos.service';
import { CreateAlergenoDto, UpdateAlergenoDto } from '@app/common';

@Controller()
export class AlergenosController {
  constructor(private readonly alergenosService: AlergenosService) {}

  @MessagePattern({ cmd: 'create_allergen' })
  create(@Payload() createAlergenoDto: CreateAlergenoDto) {
    return this.alergenosService.create(createAlergenoDto);
  }

  @MessagePattern({ cmd: 'find_all_allergens' })
  findAll() {
    return this.alergenosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_allergen' })
  findOne(@Payload() id: string) {
    return this.alergenosService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_allergen' })
  update(@Payload() updateAlergenoDto: UpdateAlergenoDto) {
    return this.alergenosService.update(updateAlergenoDto.id, updateAlergenoDto);
  }

  @MessagePattern({ cmd: 'remove_allergen' })
  remove(@Payload() id: string) {
    return this.alergenosService.remove(id);
  }
}