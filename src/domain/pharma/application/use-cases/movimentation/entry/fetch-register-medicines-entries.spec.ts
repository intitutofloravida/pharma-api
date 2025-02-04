import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicine } from 'test/factories/make-medicine'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { FetchRegisterMedicinesEntriesUseCase } from './fetch-register-medicines-entries'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMovementType } from 'test/factories/make-movement-type'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { makeMedicineEntry } from 'test/factories/make-medicine-entry'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let sut: FetchRegisterMedicinesEntriesUseCase
describe('Fetch Register Medicines Entries', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionsRepository)
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository()
    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
      inMemoryOperatorsRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesStockRepository,
    )

    sut = new FetchRegisterMedicinesEntriesUseCase(inMemoryMedicinesEntriesRepository)
  })

  it('should be able to fetch medicines entries', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
    })
    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 0,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    medicineStock.addBatchStockId(batchStock.id)

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const movementType = makeMovementType()
    await inMemoryMovementTypesRepository.create(movementType)

    await inMemoryMedicinesEntriesRepository.create(
      makeMedicineEntry({
        quantity: 10,
        batcheStockId: batchStock.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )
    await inMemoryMedicinesEntriesRepository.create(
      makeMedicineEntry({
        quantity: 20,
        batcheStockId: batchStock.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )
    await inMemoryMedicinesEntriesRepository.create(
      makeMedicineEntry({
        quantity: 30,
        batcheStockId: batchStock.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.medicinesEntries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ quantityToEntry: 10 }),
          expect.objectContaining({ quantityToEntry: 20 }),
          expect.objectContaining({ quantityToEntry: 30 }),
        ]),
      )
    }
  })

  it('should be able to fetch paginated medicines entries', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const operator2 = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator2)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
    })
    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 0,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    medicineStock.addBatchStockId(batchStock.id)

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const movementType = makeMovementType()
    await inMemoryMovementTypesRepository.create(movementType)

    for (let i = 1; i <= 22; i++) {
      await inMemoryMedicinesEntriesRepository.create(
        makeMedicineEntry({
          batcheStockId: batchStock.id,
          medicineStockId: medicineStock.id,
          operatorId: operator.id,
        }),
      )
    }

    for (let i = 1; i <= 5; i++) {
      await inMemoryMedicinesEntriesRepository.create(
        makeMedicineEntry({
          batcheStockId: batchStock.id,
          medicineStockId: medicineStock.id,
          operatorId: operator2.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      institutionId: institution.id.toString(),
    })
    const result2 = await sut.execute({
      page: 1,
      institutionId: institution.id.toString(),
      operatorId: operator2.id.toString(),
      stockId: stock.id.toString(),
      medicineId: medicine.id.toString(),
      medicineVariantId: medicineVariant.id.toString(),
    })
    if (result.isRight() && result2.isRight()) {
      expect(result.value?.medicinesEntries).toHaveLength(7)
      expect(result2.value?.medicinesEntries).toHaveLength(5)
    }
  })
})
