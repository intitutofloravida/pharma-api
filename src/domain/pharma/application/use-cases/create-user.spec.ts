import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user'
import { InMemoryPathologyRepository } from 'test/repositories/in-memory-pathology-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makePathology } from 'test/factories/make-pathology'
import { faker } from '@faker-js/faker'

let inMemoryPathologyRepository: InMemoryPathologyRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: CreateUserUseCase

describe('User', () => {
  beforeEach(() => {
    inMemoryPathologyRepository = new InMemoryPathologyRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateUserUseCase(inMemoryUserRepository, inMemoryPathologyRepository)
  })
  it('should be able create a user', async () => {
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )
    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
      addressId: '123',
      pathologiesIds: [
        '1',
        '2',
      ],
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUserRepository.items).toHaveLength(1)
      expect(inMemoryUserRepository.items[0].getFormattedCpf()).toBe(
        result.value?.user.getFormattedCpf(),
      )
    }
  })

  it('not should allowed duplicity at cpf', async () => {
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )

    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: '12345678910',
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
      addressId: '123',
      pathologiesIds: [
        '1',
        '2',
      ],
    })

    const result2 = await sut.execute({
      name: faker.person.fullName(),
      cpf: '12345678910',
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
      addressId: '123',
      pathologiesIds: [
        '1',
        '2',
      ],
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUserRepository.items).toHaveLength(1)
      expect(inMemoryUserRepository.items[0].cpf).toBe(
        result.value?.user.cpf,
      )
    }
  })

  it('not should allowed duplicity at SUS card', async () => {
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologyRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )

    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: '123456789012345',
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
      addressId: '123',
      pathologiesIds: [
        '1',
        '2',
      ],
    })

    const result2 = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: '123456789012345',
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
      addressId: '123',
      pathologiesIds: [
        '1',
        '2',
      ],
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUserRepository.items).toHaveLength(1)
      expect(inMemoryUserRepository.items[0].getFormattedCpf()).toBe(
        result.value?.user.getFormattedCpf(),
      )
    }
  })
})
