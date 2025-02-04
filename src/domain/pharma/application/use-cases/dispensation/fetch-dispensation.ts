import { Either, right } from '@/core/either'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'

interface FetchDispensationsUseCaseRequest {
  page: number
  patientId?: string
}

type FetchDispensationsUseCaseResponse = Either<
  null,
  {
    dispensations: Dispensation[],
    meta: Meta
  }
>

@Injectable()
export class FetchDispensationsUseCase {
  constructor(private dispensationsRepository: DispensationsMedicinesRepository) {}

  async execute({
    page,
    patientId,
  }: FetchDispensationsUseCaseRequest): Promise<FetchDispensationsUseCaseResponse> {
    const { dispensations, meta } = await this.dispensationsRepository.findMany({ page }, { patientId })

    return right({
      dispensations,
      meta,
    })
  }
}
