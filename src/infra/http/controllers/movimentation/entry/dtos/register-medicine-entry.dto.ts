import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsISO8601, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

class BatchDto {
  @ApiProperty({ description: 'ID do lote', example: 'batch123' })
  @IsString()
  batchId!: string

  @ApiProperty({
    description: 'Quantidade para entrada',
    example: 100,
  })
  @IsNumber()
  quantityToEntry!: number
}

class NewBatchDto {
  @ApiProperty({ description: 'Código do lote', example: 'ABCDE3' })
  @IsString()
  code: string

  @ApiProperty({
    description: 'Data de validade',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  expirationDate: Date

  @ApiProperty({ description: 'ID do fabricante', example: 'manufacturer123' })
  @IsString()
  manufacturerId: string

  @ApiProperty({
    description: 'Data de fabricação',
    example: '2024-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  manufacturingDate: Date

  @ApiProperty({
    description: 'Quantidade para entrada',
    example: 10,
  })
  @IsNumber()
  quantityToEntry: number
}

export class RegisterMedicineEntryDto {
  @ApiProperty({
    description: 'Lista de lotes existentes para entrada',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchDto)
  batches?: BatchDto[]

  @ApiProperty({
    description: 'Tipo de movimento',
    example: '033353fa-6a5a-42d7-889f-f1bb3687202e',
  })
  @IsString()
  movementTypeId: string

  @ApiProperty({
    description: 'Data de entrada',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  entryDate: Date

  @ApiProperty({
    description: 'Lista de novos lotes para entrada',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewBatchDto)
  newBatches?: NewBatchDto[]
}
