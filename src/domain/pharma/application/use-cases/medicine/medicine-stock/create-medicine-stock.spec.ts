import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { CreateMedicineStockUseCase } from './create-medicine-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: CreateMedicineStockUseCase

describe('Medicine Stock', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository()

    sut = new CreateMedicineStockUseCase(
      inMemoryStocksRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryBatchesRepository,
      inMemoryBatchStocksRepository,
      inMemoryMedicinesStockRepository,
    )
  })
  it('shoult be able create a medicine stock', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(result.value?.medicineStock.quantity)
    }
  })
  it('not should allowed duplicity', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    const result2 = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].id).toBe(result.value?.medicineStock.id)
    }
  })
})
