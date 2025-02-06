import { PaymentStatus } from '@prisma/client';
import { PaymentDetailDto } from './payment-detail.dto';

export class UpdatePaymentDto {
  client_id?: number;
  order_id?: number;
  amount?: number;
  payment_date?: string;
  status?: PaymentStatus;
  method?: string;
  transaction_id?: string;
  details?: PaymentDetailDto[];
  prepaid?: number;
}