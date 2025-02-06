import { IsNumber, IsOptional, IsString, IsEnum, IsDateString, IsArray } from 'class-validator';
import { PaymentStatus } from '@prisma/client'; // ✅ Solo una importación

export class CreatePaymentDto {
  @IsNumber()
  client_id: number;

  @IsNumber()
  order_id: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  prepaid?: number;  // ✅ Agregado

  @IsDateString()
  @IsOptional()
  payment_date?: string; // ✅ Corregido

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  method: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsArray()
  @IsOptional()
  details?: {
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  installments?: number;
}
