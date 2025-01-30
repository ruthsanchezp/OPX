import { Module } from '@nestjs/common';
import { MedicalOrdersService } from './medical-orders.service';
import { MedicalOrdersController } from './medical-orders.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MedicalOrdersController],  // 📌 Registra el controlador
  providers: [MedicalOrdersService, PrismaService],  // 📌 Registra los servicios
  exports: [MedicalOrdersService],  // 📌 Si lo necesitas en otros módulos
})
export class MedicalOrdersModule {}
