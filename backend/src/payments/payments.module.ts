// payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service'; 
@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, EmailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}