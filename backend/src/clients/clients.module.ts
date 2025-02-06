import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MedicalOrdersService } from '../medical-orders/medical-orders.service';
import { MedicalOrdersModule } from '../medical-orders/medical-orders.module'; // ✅ Importar
import { PaymentsModule } from '../payments/payments.module'; // ✅ Importamos PaymentsModule

@Module({
  imports: [MedicalOrdersModule,PaymentsModule],
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, MedicalOrdersService], // ✅ Agregado
})
export class ClientsModule {}
