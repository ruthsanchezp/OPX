import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException, // ✅ Agregado
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Obtener todos los clientes
  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }

  // Obtener un cliente por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.clientsService.findOne(id);
  }

  // ✅ Buscar cliente por ID Fiscal
  @Get('search/:idFiscal')
  async findByIdFiscal(@Param('idFiscal') idFiscal: string) {
    const client = await this.clientsService.findByIdFiscal(idFiscal);
    if (!client) {
      throw new NotFoundException(`Client with ID Fiscal ${idFiscal} not found`);
    }
    return client;
  }

  // Crear un nuevo cliente
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  // Actualizar un cliente por ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  // Eliminar un cliente por ID
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.clientsService.delete(id);
  }
}
