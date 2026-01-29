import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReclamoDto {
  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @IsString()
  @IsNotEmpty()
  nombreCompleto: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  departamento: string;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsString()
  @IsOptional()
  distrito?: string;

  @IsString()
  @IsNotEmpty()
  tipoReclamacion: string;

  @IsString()
  @IsNotEmpty()
  detalle: string;

  @IsString()
  @IsOptional()
  pedidoConsumidor?: string;
}
