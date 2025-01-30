export class CreateAgreementDto {
  agreement_type: string;
  start_date?: string;  // Cambiado a string para recibir desde el frontend
  end_date?: string;    // Cambiado a string para recibir desde el frontend
  status: string;
  total_installments?: number;
}
