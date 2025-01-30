import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  // Listar todos los acuerdos
  @Get()
  async findAll() {
    return this.agreementsService.findAll();
  }

  // Obtener un acuerdo por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const agreement = await this.agreementsService.findOne(id);
    if (!agreement) {
      throw new NotFoundException(`Agreement with ID ${id} not found`);
    }
    return agreement;
  }

  // Crear un nuevo acuerdo
  @Post()
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    return this.agreementsService.create(createAgreementDto);
  }

  // Actualizar un acuerdo por ID
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAgreementDto: UpdateAgreementDto) {
    return this.agreementsService.update(id, updateAgreementDto);
  }

  // Eliminar un acuerdo por ID
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.agreementsService.remove(id);
  }
}
