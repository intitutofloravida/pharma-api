import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import { MovementType } from '@/domain/pharma/enterprise/entities/movement-type'

export class InMemoryMovementTypesRepository implements MovementTypesRepository {
  public items: MovementType[] = []

  async create(movementType: MovementType): Promise<void> {
    this.items.push(movementType)
  }

  async findByContent(content: string): Promise<MovementType | null> {
    const movementType = this.items.find(movementType => {
      return movementType.content.toLocaleLowerCase().includes(content.toLocaleLowerCase())
    })

    if (!movementType) {
      return null
    }

    return movementType
  }
}
