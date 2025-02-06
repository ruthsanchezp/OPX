import { PaymentStatus } from '@prisma/client';  // ✅ Importación correcta

export class UpdateAgreementDto {
  name: string;  // ✅ Agregar este campo obligatorio
  agreement_type?: string;
  start_date?: string;
  end_date?: string;
  status?: PaymentStatus;  // ✅ Se usa el ENUM correctamente
  total_installments?: number;
}
