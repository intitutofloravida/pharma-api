import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateMovementTypeDto } from './dtos/create-movement-type-dto'
import { CreateMovementTypeUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/movement-type/create-movement-type'

@ApiTags('movement-type')
@ApiBearerAuth()
@Controller('/movement-type')

@UseGuards(JwtAuthGuard)
export class CreateMovementTypeController {
  constructor(
    private createMovementType: CreateMovementTypeUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateMovementTypeDto) {
    const { content, direction } = body

    const result = await this.createMovementType.execute({
      content,
      direction,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
