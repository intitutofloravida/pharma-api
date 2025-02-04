import { left, right, type Either } from '@/core/either'
import { MovementType, type MovementDirection } from '../../../../enterprise/entities/movement-type'
import { Injectable } from '@nestjs/common'
import { MovementTypeAlreadyExistsError } from './_errors/movement-type-already-exists-error'
import { MovementTypesRepository } from '../../../repositories/movement-type'

interface createMovementTypeUseCaseRequest {
  content: string,
  direction: MovementDirection
}

type createMovementTypeUseCaseResponse = Either<
 MovementTypeAlreadyExistsError,
  {
    movementtype: MovementType
  }
>

@Injectable()
export class CreateMovementTypeUseCase {
  constructor(private movementtypeRepository: MovementTypesRepository) {}
  async execute({ content, direction }: createMovementTypeUseCaseRequest): Promise<createMovementTypeUseCaseResponse> {
    const movementtype = MovementType.create({
      content,
      direction,
    })

    const contentExists = await this.movementtypeRepository.findByContent(content)
    if (contentExists) {
      return left(new MovementTypeAlreadyExistsError(content))
    }

    await this.movementtypeRepository.create(movementtype)

    return right({
      movementtype,
    })
  }
}
