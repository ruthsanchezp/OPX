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
import { MedicalOrdersService } from '../medical-orders/medical-orders.service'; // 👈 Importar el servicio de órdenes médicas
import { PaymentsService } from '../payments/payments.service'; // ✅ Importamos el servicio de pagos

@Controller('clients')
export class ClientsController {
  constructor(
  private readonly clientsService: ClientsService,     
  private readonly medicalOrdersService: MedicalOrdersService, // 👈 Agregar esto
  private readonly paymentsService: PaymentsService // ✅ Inyectamos PaymentsService

  ) {}

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
  @Get(':client_id/medical-orders')
  async getClientMedicalOrders(@Param('client_id') clientId: string) {
    const parsedClientId = parseInt(clientId, 10); // 🔹 Convertir `clientId` a número
    if (isNaN(parsedClientId)) {
      throw new NotFoundException(`Invalid client ID: ${clientId}`);
    }
    return this.medicalOrdersService.getClientMedicalOrders(parsedClientId);
  }

@Get(':client_id/payments')
async getClientPayments(@Param('client_id') clientId: string) {
  const parsedClientId = parseInt(clientId, 10);
  if (isNaN(parsedClientId)) {
    throw new NotFoundException(`Invalid client ID: ${clientId}`);
  }
  return this.paymentsService.findByClient(parsedClientId);
}

}
