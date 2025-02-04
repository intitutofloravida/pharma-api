import { RegisterExitUseCase } from './register-exit'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: RegisterExitUseCase

describe('Register Exit', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository()
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )
    sut = new RegisterExitUseCase(
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
    )
  })
  it('shoult be able to register a new exit', async () => {
    const quantityToExit = 5

    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({ institutionId: institution.id })
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 30,
    })

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryMedicinesStockRepository.replenish(
      medicineStock.id.toString(),
      30,
    )
    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchestock1.id.toString(),
    )
    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExit,
    })

    console.log(result.value)
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesExitsRepository.items[0].quantity).toBe(
        quantityToExit,
      )
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        30 - quantityToExit,
      )
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(
        30 - quantityToExit,
      )
    }
  })

  it('shoult not be able to register a new exit with quantity less or equal zero', async () => {
    const quantityZeroToExit = 0
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 50,
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchestock1.id.toString(),
    )
    await inMemoryMedicinesStockRepository.replenish(medicineStock.id.toString(), 50)

    await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityZeroToExit + 5,
    })
    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityZeroToExit,
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(45)
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(45)
    }
  })
  it('shoult not be to keep stock updated for exits from different batches', async () => {
    const quantityToExitBatch1 = 10
    const quantityToExitBatch2 = 15
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 30,
    })
    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchStock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 25,
    })
    medicineStock.batchesStockIds = [batchestock1.id, batchestock2.id]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryBatchStocksRepository.create(batchestock2)
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchestock1.id.toString(),
    )
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchestock2.id.toString(),
    )
    await inMemoryMedicinesStockRepository.replenish(medicineStock.id.toString(), 55)

    const result1 = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExitBatch1,
    })
    const result2 = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batcheStockId: batchestock2.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExitBatch2,
    })

    expect(result1.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(2)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        30 - quantityToExitBatch1 + (25 - quantityToExitBatch2),
      )
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(
        30 - quantityToExitBatch1,
      )
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(
        25 - quantityToExitBatch2,
      )
    }
  })
})
