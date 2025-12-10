import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@app/common';

@Controller()
export class CategoriasController {
  constructor(private readonly categoriesService: CategoriasService) {}

  @MessagePattern({ cmd: 'create_category' })
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({ cmd: 'find_all_categories' })
  findAll(@Payload() includeInactive: boolean) {
    return this.categoriesService.findAll(includeInactive);
  }

  @MessagePattern({ cmd: 'find_one_category' })
  findOne(@Payload() id: string) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_category' })
  update(@Payload() data: { id: string; updateCategoryDto: UpdateCategoryDto }) {
    return this.categoriesService.update(data.id, data.updateCategoryDto);
  }

  @MessagePattern({ cmd: 'remove_category' })
  remove(@Payload() id: string) {
    return this.categoriesService.remove(id);
  }

  @MessagePattern({ cmd: 'get_menu' })
  getMenu() {
    return this.categoriesService.getMenu();
  }
}