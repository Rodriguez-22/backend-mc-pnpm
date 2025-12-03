import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categorias.service';
import { CreateCategoryDto } from '../../../../libs/common/src/dto/ms-productos/categorias/create-categoria.dto';
import { UpdateCategoryDto } from '../../../../libs/common/src/dto/ms-productos/categorias/update-categoria.dto';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../libs/common/src/decorators/roles.decorator';
import { UserRole } from '../../../../libs/common/src/enums/user-role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Endpoint público para el menú
  @Get('menu')
  async getMenu() {
    return await this.categoriesService.getMenu();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KITCHEN_MANAGER)
  async findAll(@Query('includeInactive') includeInactive?: string) {
    return await this.categoriesService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KITCHEN_MANAGER)
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { message: 'Categoría eliminada correctamente' };
  }
}