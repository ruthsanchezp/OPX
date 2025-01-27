import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 50)
  role: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
