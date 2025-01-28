import { IsString, IsOptional, IsISO8601, IsNumber } from 'class-validator';

// DTO para actualizar acuerdos (agreements)
export class UpdateAgreementDto {
  @IsOptional()
  @IsNumber()
  agreement_id?: number; // ID único del acuerdo para identificarlo

  @IsOptional()
  @IsString()
  agreement_type?: string; // Tipo de acuerdo

  @IsOptional()
  @IsISO8601()
  start_date?: string; // Fecha de inicio en formato ISO-8601

  @IsOptional()
  @IsISO8601()
  end_date?: string; // Fecha de fin en formato ISO-8601

  @IsOptional()
  @IsString()
  status?: string; // Estado del acuerdo

  @IsOptional()
  @IsNumber()
  total_amount?: number; // Monto total del acuerdo

  @IsOptional()
  @IsNumber()
  total_installments?: number; // Número total de cuotas del acuerdo
}
