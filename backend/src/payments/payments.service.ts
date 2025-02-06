import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Obtener todos los pagos
  async findAll() {
    return await this.prisma.payment.findMany({
      include: {
        client: true,
        order: true,
        details: true,
      },
    });
  }

  // ✅ Obtener un pago por ID
  async findOne(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: paymentId },
      include: {
        client: true,
        order: true,
        details: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    return payment;
  }

  async findByClient(clientId: number) {
    return this.prisma.payment.findMany({
      where: { client_id: clientId },
      include: {
        details: true,       // ✅ Muestra los detalles de pago
        installments: true,  // ✅ Muestra las cuotas si existen
      },
    });
  }
  
  async create(createPaymentDto: CreatePaymentDto) {
    if (!createPaymentDto.client_id) {
      throw new Error("Client ID is required.");
    }
    if (!createPaymentDto.order_id) {
      throw new Error("Order ID is required.");
    }

    // ✅ Verificar si ya existe un pago para esta orden
    const existingPayment = await this.prisma.payment.findUnique({
      where: { order_id: createPaymentDto.order_id },
    });

    if (existingPayment) {
      // ✅ Enviar un error controlado en lugar de lanzar una excepción
      return {
        success: false,
        message: `A payment is already associated with Order ID ${createPaymentDto.order_id}. Please create a new medical order.`,
      };
    }

    const prepaid = createPaymentDto.prepaid || 0;
    const installments = createPaymentDto.installments || 1;
    const remainingAmount = createPaymentDto.amount - prepaid;
    const amountPerInstallment = remainingAmount / installments;

    return await this.prisma.payment.create({
      data: {
        client_id: createPaymentDto.client_id,
        order_id: createPaymentDto.order_id, 
        amount: createPaymentDto.amount,
        prepaid: prepaid,
        payment_date: createPaymentDto.payment_date ? new Date(createPaymentDto.payment_date) : new Date(),
        status: createPaymentDto.status || PaymentStatus.PENDING,
        method: createPaymentDto.method,
        transaction_id: createPaymentDto.transaction_id || null,

        details: {
          create: createPaymentDto.details?.map((detail) => ({
            description: detail.description,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            total_price: detail.quantity * detail.unit_price,
          })) || [],
        },

        installments: {
          create: installments > 1
            ? Array.from({ length: installments }).map((_, i) => ({
                due_date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
                amount: amountPerInstallment,
                status: PaymentStatus.PENDING,
              }))
            : [],
        },
      },
      include: {
        details: true,
        installments: true,
      },
    });
  }


  // ✅ Actualizar un pago existente
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return await this.prisma.payment.update({
      where: { payment_id: id },
      data: {
        client_id: updatePaymentDto.client_id,
        order_id: updatePaymentDto.order_id,
        amount: updatePaymentDto.amount,
        prepaid: updatePaymentDto.prepaid || 0, // ✅ Agregado
        payment_date: updatePaymentDto.payment_date ? new Date(updatePaymentDto.payment_date) : undefined,
        status: updatePaymentDto.status || undefined, // ✅ ENUM
        method: updatePaymentDto.method,
        transaction_id: updatePaymentDto.transaction_id,
        details: {
          create: updatePaymentDto.details?.map((detail) => ({
            description: detail.description,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            total_price: detail.quantity * detail.unit_price,
          })) || [],
        },
      },
      include: {
        details: true,
      },
    });
  }

  async addInstallmentPayment(paymentId: number, amount: number) {
    // Obtener la factura con sus cuotas
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: paymentId },
      include: { installments: true },
    });
  
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found.`);
    }
  
    // Buscar la primera cuota pendiente
    const pendingInstallment = payment.installments.find((i) => i.status === "PENDING");
  
    if (!pendingInstallment) {
      throw new Error("All installments have been paid.");
    }
  
    // Actualizar el monto pagado de la cuota
    const updatedInstallment = await this.prisma.installment.update({
      where: { installment_id: pendingInstallment.installment_id },
      data: {
        paid_amount: pendingInstallment.paid_amount + amount,
        status: pendingInstallment.paid_amount + amount >= pendingInstallment.amount ? "COMPLETED" : "PENDING",
      },
    });
  
    return updatedInstallment;
  }
  

  // ✅ Eliminar un pago
  async remove(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return await this.prisma.$transaction([
      this.prisma.paymentDetail.deleteMany({
        where: { payment_id: id },
      }),
      this.prisma.payment.delete({
        where: { payment_id: id },
      }),
    ]);
  }
  async deleteInstallment(installmentId: number) {
    return await this.prisma.installment.delete({
      where: { installment_id: installmentId },
    });
  }
  
  
}
