import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ✅ Obtener todos los pagos
  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  // ✅ Obtener un pago por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(Number(id));
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  // ✅ Obtener todos los pagos de un cliente
  @Get('/client/:clientId')
  async getPaymentsByClient(@Param('clientId') clientId: string) {
    return this.paymentsService.findByClient(Number(clientId));
  }

  // ✅ Crear un nuevo pago
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  // ✅ Actualizar un pago
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(Number(id), updatePaymentDto);
  }

  // ✅ Eliminar un pago
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentsService.remove(Number(id));
  }
}
