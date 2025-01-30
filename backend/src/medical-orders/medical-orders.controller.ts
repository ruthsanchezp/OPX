import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { MedicalOrdersService } from './medical-orders.service';
import { CreateMedicalOrderDto } from './dto/create-medical-order.dto';
import { UpdateMedicalOrderDto } from './dto/update-medical-order.dto';

@Controller('medical-orders') //
export class MedicalOrdersController {
  constructor(private readonly medicalOrdersService: MedicalOrdersService) {}

  // ✅ Obtener todas las órdenes médicas
  @Get()
  async findAll() {
    return this.medicalOrdersService.findAll();
  }

  // ✅ Obtener una orden médica por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.medicalOrdersService.findOne(Number(id));
    if (!order) {
      throw new NotFoundException(`Medical Order with ID ${id} not found`);
    }
    return order;
  }

  // ✅ Crear una nueva orden médica
  @Post()
  async create(@Body() createMedicalOrderDto: CreateMedicalOrderDto) {
    return this.medicalOrdersService.create(createMedicalOrderDto);
  }

  // ✅ Editar una orden médica
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalOrderDto: UpdateMedicalOrderDto
  ) {
    return this.medicalOrdersService.update(Number(id), updateMedicalOrderDto);
  }

  // ✅ Eliminar una orden médica
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.medicalOrdersService.remove(Number(id));
  }
}
