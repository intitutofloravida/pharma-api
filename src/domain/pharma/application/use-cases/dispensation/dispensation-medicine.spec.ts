import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { DispensationMedicineUseCase } from './dispensation-medicine'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryDispensationsMedicinesRepository: InMemoryDispensationsMedicinesRepository
let sut: DispensationMedicineUseCase

describe('Dispensation Medicine', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryPatientsRepository = new InMemoryPatientsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository()
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
    inMemoryDispensationsMedicinesRepository = new InMemoryDispensationsMedicinesRepository()

    sut = new DispensationMedicineUseCase(
      inMemoryDispensationsMedicinesRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
    )
  })
  it('should be able to dispense a medication', async () => {
    const quantityToDispense = 5
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const stock = makeStock({ institutionId: institution.id })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const batch1 = makeBatch({
      manufacturerId: manufacturer.id,
    })
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 20,
    })

    medicineStock.batchesStockIds = [batchestock1.id]
    medicineStock.quantity = batchestock1.quantity

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      patientId: patient.id.toString(),
      batchesStocks: [
        {
          batchStockId: batchestock1.id.toString(),
          quantity: quantityToDispense,
        },
      ],
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryDispensationsMedicinesRepository.items[0].totalQuantity).toEqual(result.value.dispensation.totalQuantity)

      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(20 - quantityToDispense)
    }
  })
  it('should not be able to dispense a medication with batch expired', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const date = new Date('2024-02-15')
    vi.setSystemTime(date)

    const quantityToDispense = 5
    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch({
      expirationDate: new Date('2024-02-15'),
    })
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 20,
    })
    medicineStock.batchesStockIds = [batchestock1.id]
    medicineStock.quantity = batchestock1.quantity

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      patientId: patient.id.toString(),
      batchesStocks: [
        {
          batchStockId: batchestock1.id.toString(),
          quantity: quantityToDispense,
        },
      ],
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(0)
      expect(inMemoryBatchStocksRepository.items[0]).toBe(20)
    }
  })
  it('should be able to dispense quantities of the same medication in different batches', async () => {
    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
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
      currentQuantity: 20,
    })

    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchStock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 10,
    })

    medicineStock.batchesStockIds = [batchestock1.id, batchestock2.id]
    medicineStock.quantity = batchestock1.quantity + batchestock2.quantity

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryBatchStocksRepository.create(batchestock2)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      patientId: patient.id.toString(),
      batchesStocks: [
        {
          batchStockId: batchestock1.id.toString(),
          quantity: 5,
        },
        {
          batchStockId: batchestock2.id.toString(),
          quantity: 10,
        },
      ],
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryDispensationsMedicinesRepository.items[0].totalQuantity).toEqual(result.value.dispensation.totalQuantity)

      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(15)
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(0)
    }
  })
})
