import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class QuoteItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  productName?: string;
}

export class CreateCotizacionDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerCompany?: string;

  @IsOptional()
  @IsString()
  customerDocument?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsString()
  @IsNotEmpty()
  need: string;

  @IsOptional()
  @IsString()
  delivery?: string;

  @IsOptional()
  @IsString()
  estimatedDate?: string;

  @IsOptional()
  @IsString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  montoTotal?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  preferredChannel?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  technicianName?: string;

  @IsOptional()
  @IsString()
  technicianPhone?: string;

  @IsOptional()
  @IsString()
  technicianEmail?: string;

  @IsOptional()
  @IsString()
  installationTechnician?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];
}
