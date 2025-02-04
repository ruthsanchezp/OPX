import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalOrderDto } from './dto/create-medical-order.dto';
import { UpdateMedicalOrderDto } from './dto/update-medical-order.dto';

@Injectable()
export class MedicalOrdersService {
  constructor(private prisma: PrismaService) {}

  // ✅ Obtener todas las órdenes médicas
  async findAll() {
    return await this.prisma.medicalOrder.findMany({
      include: {
        client: true,
        createdBy: true, // Médico que creó la orden
        graduations: true, // Lentes de lejos
        graduationsNear: true, // Lentes de cerca
      },
    });
  }

  // ✅ Obtener una orden médica por ID
  async findOne(id: number) {
    const order = await this.prisma.medicalOrder.findUnique({
      where: { order_id: id },
      include: {
        client: true,
        createdBy: true,
        graduations: true,
        graduationsNear: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Medical order with ID ${id} not found`);
    }
    return order;
  }

  // ✅ Crear una nueva orden médica
  async create(createMedicalOrderDto: CreateMedicalOrderDto) {
    console.log("📥 Recibiendo en el backend:", createMedicalOrderDto);

    return await this.prisma.medicalOrder.create({
      data: {
        client_id: Number(createMedicalOrderDto.client_id),
        created_by: Number(createMedicalOrderDto.created_by),
        created_at: new Date(),

        graduations: {
          create: createMedicalOrderDto.graduations?.map((grad) => ({
            eye: grad.eye,
            SPH: grad.SPH ? parseFloat(String(grad.SPH)) : 0,
            CYL: grad.CYL ? parseFloat(String(grad.CYL)) : 0,
            EJE: grad.EJE ? parseFloat(String(grad.EJE)) : 0,
            DP: grad.DP ? parseFloat(String(grad.DP)) : 0,
          })) || [],
        },

        graduationsNear: {
          create: createMedicalOrderDto.graduationsNear?.map((grad) => ({
            eye: grad.eye,
            SPH: grad.SPH ? parseFloat(String(grad.SPH)) : 0,
            CYL: grad.CYL ? parseFloat(String(grad.CYL)) : 0,
            EJE: grad.EJE ? parseFloat(String(grad.EJE)) : 0,
            DP: grad.DP ? parseFloat(String(grad.DP)) : 0,
          })) || [],
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

  // ✅ Actualizar una orden médica
  async update(id: number, updateMedicalOrderDto: UpdateMedicalOrderDto) {
    const existingOrder = await this.prisma.medicalOrder.findUnique({
      where: { order_id: id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Medical order with ID ${id} not found`);
    }

    return await this.prisma.$transaction([
      // ✅ Eliminar graduaciones previas
      this.prisma.graduation.deleteMany({
        where: { order_id: id },
      }),
      this.prisma.graduationNear.deleteMany({
        where: { order_id: id },
      }),

      // ✅ Actualizar la orden médica con nuevas graduaciones
      this.prisma.medicalOrder.update({
        where: { order_id: id },
        data: {
          client_id: Number(updateMedicalOrderDto.client_id),
          created_by: Number(updateMedicalOrderDto.created_by),

          graduations: {
            create: updateMedicalOrderDto.graduations?.map((grad) => ({
              eye: grad.eye,
              SPH: typeof grad.SPH === "number" ? grad.SPH : 0,
              CYL: typeof grad.CYL === "number" ? grad.CYL : 0,
              EJE: typeof grad.EJE === "number" ? grad.EJE : 0,
              DP: typeof grad.DP === "number" ? grad.DP : 0,
            })) || [],
          },

          graduationsNear: {
            create: updateMedicalOrderDto.graduationsNear?.map((grad) => ({
              eye: grad.eye,
              SPH: typeof grad.SPH === "number" ? grad.SPH : 0,
              CYL: typeof grad.CYL === "number" ? grad.CYL : 0,
              EJE: typeof grad.EJE === "number" ? grad.EJE : 0,
              DP: typeof grad.DP === "number" ? grad.DP : 0,
            })) || [],
          },

          observaciones: updateMedicalOrderDto.observaciones ?? "",
          cristales: updateMedicalOrderDto.cristales ?? "",
        },
        include: {
          graduations: true,
          graduationsNear: true,
        },
      }),
    ]);
  }
  async getClientMedicalOrders(clientId: number) { // ✅ Ahora recibe un número
    return this.prisma.medicalOrder.findMany({
      where: { client_id: clientId }, // ✅ clientId ahora es un número
      include: {
        graduations: true,
        graduationsNear: true,
      },
    });
  }
  
  

  // ✅ Eliminar una orden médica
  async remove(id: number) {
    const order = await this.prisma.medicalOrder.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Medical order with ID ${id} not found`);
    }

    return await this.prisma.$transaction([
      // 🔹 Primero, eliminar las dependencias (Graduaciones y GraduacionesNear)
      this.prisma.graduation.deleteMany({
        where: { order_id: id },
      }),
      this.prisma.graduationNear.deleteMany({
        where: { order_id: id },
      }),

      // 🔹 Finalmente, eliminar la orden médica
      this.prisma.medicalOrder.delete({
        where: { order_id: id },
      }),
    ]);
  }
}
