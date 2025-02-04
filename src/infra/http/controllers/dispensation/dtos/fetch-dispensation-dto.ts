import { IsOptional, Min, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchDispensationsDto {
  @ApiProperty({
    description: 'Número da página para a listagem',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1

  @ApiProperty({
    description: 'ID do paciente (opcional).',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  patientId?: string
}
