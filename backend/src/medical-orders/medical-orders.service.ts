import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalOrderDto } from './dto/create-medical-order.dto';
import { UpdateMedicalOrderDto } from './dto/update-medical-order.dto';
import * as pdf from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class MedicalOrdersService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas las órdenes médicas con información del paciente y creador
  async findAll() {
    return await this.prisma.medicalOrder.findMany({
      include: {
        client: true,
        createdBy: true, // Nombre del usuario que generó la orden
        graduations: true, // Lentes de Lejos
        graduationsNear: true, // Lentes de Cerca
      },
    });
  }

  // Obtener una orden médica por ID
  async findOne(id: number) {
    const order = await this.prisma.medicalOrder.findUnique({
      where: { order_id: id },
      include: {
        client: true,
        createdBy: true,
        graduations: true, // Lentes de Lejos
        graduationsNear: true, // Lentes de Cerca
      },
    });

    if (!order) {
      throw new NotFoundException(`Medical order with ID ${id} not found`);
    }
    return order;
  }

  // Crear una nueva orden médica
  async create(createMedicalOrderDto: CreateMedicalOrderDto) {
    return await this.prisma.medicalOrder.create({
      data: {
        client_id: Number(createMedicalOrderDto.client_id),
        created_by: Number(createMedicalOrderDto.created_by),
        graduations: {
          create: createMedicalOrderDto.graduations.map((grad) => ({
            eye: grad.eye,
            SPH: Number(grad.SPH),
            CYL: Number(grad.CYL),
            EJE: Number(grad.EJE),
            DP: Number(grad.DP),
          })),
        },
        graduationsNear: {
          create: createMedicalOrderDto.graduationsNear.map((grad) => ({
            eye: grad.eye,
            SPH: Number(grad.SPH),
            CYL: Number(grad.CYL),
            EJE: Number(grad.EJE),
            DP: Number(grad.DP),
          })),
        },
        observaciones: createMedicalOrderDto.observaciones || "",
        cristales: createMedicalOrderDto.cristales || "",
      },
      include: {
        graduations: true,
        graduationsNear: true,
      },
    });
  }

  // Actualizar una orden médica
  async update(id: number, updateMedicalOrderDto: UpdateMedicalOrderDto) {
    try {
      // ✅ Verificación del ID
      const orderId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }
  
      return await this.prisma.$transaction([
        // ✅ Eliminar graduaciones previas correctamente
        this.prisma.graduation.deleteMany({
          where: {
            medicalOrder: {
              order_id: orderId, // ✅ Relación válida con MedicalOrder
            },
          },
        }),
        this.prisma.graduationNear.deleteMany({
          where: {
            medicalOrder: {
              order_id: orderId, // ✅ Relación válida con MedicalOrder
            },
          },
        }),
  
        // ✅ Actualizar la orden médica con nuevas graduaciones
        this.prisma.medicalOrder.update({
          where: { order_id: orderId },
          data: {
            client_id: updateMedicalOrderDto.client_id,
            created_by: updateMedicalOrderDto.created_by,
  
            // ✅ Crear nuevas graduaciones de lejos
            graduations: {
              create: updateMedicalOrderDto.graduations?.map((grad) => ({
                eye: grad.eye,
                SPH: grad.SPH,
                CYL: grad.CYL,
                EJE: grad.EJE,
                DP: grad.DP,
              })) || [],
            },
  
            // ✅ Crear nuevas graduaciones de cerca
            graduationsNear: {
              create: updateMedicalOrderDto.graduationsNear?.map((grad) => ({
                eye: grad.eye,
                SPH: grad.SPH,
                CYL: grad.CYL,
                EJE: grad.EJE,
                DP: grad.DP,
              })) || [],
            },
  
            // ✅ Actualizar observaciones y cristales
            observaciones: updateMedicalOrderDto.observaciones ?? "",
            cristales: updateMedicalOrderDto.cristales ?? "",
          },
          include: {
            graduations: true,
            graduationsNear: true,
          },
        }),
      ]);
    } catch (error) {
      console.error(`Error updating medical order with ID ${id}:`, error);
      throw error;
    }
  }
  
  
  

  // Eliminar una orden médica
  async remove(id: number) {
    return await this.prisma.medicalOrder.delete({
      where: { order_id: id },
    });
  }

  // Generar PDF con formato personalizado
  async generatePdf(id: number, res: Response) {
    const order = await this.findOne(id);

    const doc = new pdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=order_${id}.pdf`
    );

    doc.pipe(res);
    doc.fontSize(20).text('Ópticas Hammersley', { align: 'center' });

    doc.moveDown().fontSize(12).text(`Paciente: ${order.client.first_name} ${order.client.last_name}`);
    doc.text(`Edad: ${order.client.birth_date}`);
    doc.text(`Dirección: ${order.client.address}`);
    doc.text(`Ciudad: ${order.client.city}`);
    doc.text(`RUT: ${order.client.id_fiscal}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);

    doc.moveDown().text('Graduaciones Lentes de Lejos:', { underline: true });
    order.graduations.forEach((grad) => {
      doc.text(`${grad.eye}: Esf: ${grad.SPH}, Cil: ${grad.CYL}, Eje: ${grad.EJE}`);
    });

    doc.moveDown().text('Graduaciones Lentes de Cerca:', { underline: true });
    order.graduationsNear.forEach((grad) => {
      doc.text(`${grad.eye}: Esf: ${grad.SPH}, Cil: ${grad.CYL}, Eje: ${grad.EJE}`);
    });

    doc.moveDown().text(`Observaciones: ${order.observaciones}`);
    doc.moveDown().text(`Cristales: ${order.cristales}`);

    doc.moveDown().text(`Médico: ${order.createdBy.name}`);
    doc.text(`RUT del Médico: ${order.createdBy.email}`);
    doc.text(`Especialidad: ${order.createdBy.role}`);

    doc.end();
  }
}
