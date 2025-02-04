import { CreateMovementTypeUseCase } from './create-movement-type'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'

let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let sut: CreateMovementTypeUseCase

describe('MovementType', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    sut = new CreateMovementTypeUseCase(inMemoryMovementTypesRepository)
  })
  it('shoult be able create a movement type', async () => {
    const result = await sut.execute({
      content: 'DONATION',
      direction: 'ENTRY',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMovementTypesRepository.items).toHaveLength(1)
      expect(inMemoryMovementTypesRepository.items[0].content).toBe(result.value?.movementtype.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'DONATION',
      direction: 'ENTRY',
    })
    const result2 = await sut.execute({
      content: 'DONATION',
      direction: 'ENTRY',
    })
    const result3 = await sut.execute({
      content: 'DISPENSATION',
      direction: 'EXIT',
    })
    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    expect(result3.isRight()).toBeTruthy()
    if (result.isRight() && result3.isRight()) {
      expect(inMemoryMovementTypesRepository.items).toHaveLength(2)
      expect(inMemoryMovementTypesRepository.items[0].id).toBe(result.value?.movementtype.id)
      expect(inMemoryMovementTypesRepository.items[1].id).toBe(result3.value?.movementtype.id)
    }
  })
})
