import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { makeDispensation } from 'test/factories/make-dispensation'
import { FetchDispensationsUseCase } from './fetch-dispensation'
import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'

let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryDispensationsRepository:InMemoryDispensationsMedicinesRepository
let sut: FetchDispensationsUseCase
describe('Fetch Dispensations', () => {
  beforeEach(() => {
    inMemoryPatientsRepository = new InMemoryPatientsRepository()
    inMemoryDispensationsRepository = new InMemoryDispensationsMedicinesRepository()

    sut = new FetchDispensationsUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to fetch dispensations', async () => {
    await inMemoryDispensationsRepository.create(
      makeDispensation({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryDispensationsRepository.create(
      makeDispensation({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryDispensationsRepository.create(
      makeDispensation({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.dispensations).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated dispensations', async () => {
    const patient1 = makePatient()
    await inMemoryPatientsRepository.create(patient1)

    const patient2 = makePatient()
    await inMemoryPatientsRepository.create(patient2)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDispensationsRepository.create(makeDispensation({
        patientId: patient1.id,
      }))
    }

    for (let i = 1; i <= 11; i++) {
      await inMemoryDispensationsRepository.create(makeDispensation({
        patientId: patient2.id,
      }))
    }

    const result = await sut.execute({
      page: 2,
    })

    const resultByPatientId = await sut.execute({
      page: 2,
      patientId: patient1.id.toString(),
    })

    expect(result.value?.dispensations).toHaveLength(13)
    expect(resultByPatientId.value?.dispensations).toHaveLength(2)
  })
})
