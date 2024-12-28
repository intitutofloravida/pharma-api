import { IsOptional, IsString, Length } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateInstitutionDTO {
  @ApiProperty({
    example: 'Instituto ABC',
    description: 'The name of the institution.',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: '12345678000190',
    description: 'The CNPJ of the institution, following the standard Brazilian format.',
  })
  @IsString()
  @Length(14, 18, { message: 'CNPJ must be between 14 and 18 characters, including punctuation.' })
  cnpj: string

  @ApiPropertyOptional({
    example: 'An institution focused on research and innovation.',
    description: 'A brief description of the institution.',
  })
  @IsOptional()
  @IsString()
  description?: string
}
