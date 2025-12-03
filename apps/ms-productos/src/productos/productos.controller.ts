import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './productos.service';
import { CreateProductDto } from '../../../../libs/common/src/dto/ms-productos/productos/create-productos.dto';
import { UpdateProductDto } from '../../../../libs/common/src/dto/ms-productos/productos/update-productos.dto';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../libs/common/src/decorators/roles.decorator';
import { UserRole } from '../../../../libs/common/src/enums/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('available')
  async findAvailable() {
    return await this.productsService.findAvailable();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return await this.productsService.search(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KITCHEN_MANAGER)
  async findAll(@Query('includeInactive') includeInactive?: string) {
    return await this.productsService.findAll(includeInactive === 'true');
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return await this.productsService.findByCategory(categoryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/toggle-availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KITCHEN_MANAGER)
  async toggleAvailability(@Param('id') id: string) {
    return await this.productsService.toggleAvailability(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Producto eliminado correctamente' };
  }
}