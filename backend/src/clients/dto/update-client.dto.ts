import {
  IsString,
  IsOptional,
  IsISO8601,
  IsEmail,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAgreementDto } from '../../agreements/dto/update-agreement.dto'; // Importa correctamente el DTO de acuerdos

// DTO para actualizar clientes
export class UpdateClientDto {
  @IsOptional()
  @IsString()
  first_name?: string; // Primer nombre del cliente

  @IsOptional()
  @IsString()
  last_name?: string; // Apellido del cliente

  @IsOptional()
  @IsString()
  id_fiscal?: string; // Identificación fiscal del cliente

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
  @IsISO8601()
  birth_date?: Date; // Fecha de nacimiento en formato ISO-8601

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAgreementDto) // Asegúrate de que este import esté definido correctamente
  agreements?: UpdateAgreementDto[]; // Arreglo de acuerdos asociados
}
