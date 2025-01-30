import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalOrderDto } from './create-medical-order.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicalOrderDto extends PartialType(CreateMedicalOrderDto) {
  id: number;
  reviewed_by?: number | null; // Mantiene el cambio de `string` a `number | null`

  @IsOptional()
  @IsString()
  observaciones?: string; // ✅ Campo corregido para Observaciones

  @IsOptional()
  @IsString()
  cristales?: string; // ✅ Campo corregido para Cristales
}
