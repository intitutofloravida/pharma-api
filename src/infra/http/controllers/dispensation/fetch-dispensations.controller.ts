import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchDispensationsUseCase } from '@/domain/pharma/application/use-cases/dispensation/fetch-dispensation'
import { FetchDispensationsDto } from './dtos/fetch-dispensation-dto'
import { DispensationPresenter } from '../../presenters/dispensation-presenter'

@ApiTags('dispensation')
@ApiBearerAuth()
@Controller('/dispensations')
export class FetchDispensationsController {
  constructor(private fetchDispensations: FetchDispensationsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchDispensationsDto) {
    const { page, patientId } = queryParams

    const result = await this.fetchDispensations.execute({ page, patientId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { dispensations, meta } = result.value

    return {
      dispensations: dispensations.map(DispensationPresenter.toHTTP),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    }
  }
}
