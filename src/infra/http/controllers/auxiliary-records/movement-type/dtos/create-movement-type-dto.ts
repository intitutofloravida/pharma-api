import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum MovementDirection {
  EXIT = 'EXIT',
  ENTRY = 'ENTRY',
}

export class CreateMovementTypeDto {
  @ApiProperty({ example: 'Transfer' })
  @IsString()
  content: string

  @ApiProperty({ example: MovementDirection.ENTRY, enum: MovementDirection })
  @IsEnum(MovementDirection)
  direction: MovementDirection
}
