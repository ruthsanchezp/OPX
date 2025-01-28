import {
  IsString,
  IsOptional,
  IsISO8601,
  IsEmail,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para crear acuerdos (agreements)
class CreateAgreementDto {
  @IsString()
  agreement_type: string; // Tipo de acuerdo (obligatorio)

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date?: Date; // Fecha de inicio en formato Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date?: Date; // Fecha de fin en formato Date

  @IsOptional()
  @IsString()
  status?: string; // Estado del acuerdo

  @IsOptional()
  total_amount?: number; // Monto total del acuerdo

  @IsOptional()
  total_installments?: number; // Número total de cuotas del acuerdo
}

// DTO para crear clientes
export class CreateClientDto {
  @IsString()
  first_name: string; // Primer nombre del cliente (obligatorio)

  @IsOptional()
  @IsString()
  last_name?: string; // Apellido del cliente

  @IsString()
  id_fiscal: string; // Identificación fiscal del cliente (obligatorio)

  @IsOptional()
  @IsString()
  phone?: string; // Teléfono del cliente

  @IsOptional()
  @IsEmail()
  email?: string; // Correo electrónico del cliente

  @IsOptional()
  @IsString()
  address?: string; // Dirección del cliente

  @IsOptional()
  @IsString()
  city?: string; // Ciudad del cliente

  @IsOptional()
  @IsString()
  country?: string; // País del cliente

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birth_date?: Date; // Fecha de nacimiento en formato Date

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAgreementDto)
  agreements?: CreateAgreementDto[]; // Arreglo de acuerdos asociados
}
