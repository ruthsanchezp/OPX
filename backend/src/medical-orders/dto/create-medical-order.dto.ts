import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateMedicalOrderDto {
  @IsNumber()
  client_id: number;

  @IsNumber()
  created_by: number;

  @IsArray()
  graduations: {
    eye: string;
    SPH: number;
    CYL: number;
    EJE: number;
    DP: number;
  }[];

  @IsArray()
  graduationsNear: {
    eye: string;
    SPH: number;
    CYL: number;
    EJE: number;
    DP: number;
  }[];

  @IsOptional()
  @IsString()
  observaciones?: string; // ✅ Nombre corregido

  @IsOptional()
  @IsString()
  cristales?: string; // ✅ Nombre corregido
}
