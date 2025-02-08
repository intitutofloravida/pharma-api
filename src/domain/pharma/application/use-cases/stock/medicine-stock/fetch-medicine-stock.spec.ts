import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { FetchMedicinesStockUseCase } from './fetch-medicine-stock'

let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let sut: FetchMedicinesStockUseCase
describe('Fetch Medicines on Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesVariantsRepository =
    new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository(
      inMemoryStocksRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryPharmaceuticalFormsRepository,
    )

    sut = new FetchMedicinesStockUseCase(inMemoryMedicinesStockRepository)
  })

  it('should be able to fetch medicines on stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      medicineVariant.id.toString(),
    )

    const medicineVariant2 = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant2)

    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      medicineVariant2.id.toString(),
    )

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 80,
      createdAt: new Date(2024, 0, 20),
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const medicineStock2 = makeMedicineStock({
      medicineVariantId: medicineVariant2.id,
      stockId: stock.id,
      currentQuantity: 50,
      createdAt: new Date(2024, 0, 29),
    })
    await inMemoryMedicinesStockRepository.create(medicineStock2)
    const result = await sut.execute({
      page: 1,
      stockId: stock.id.toString(),
    })

    expect(result.value?.medicinesStock).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      ]),
    )
  })

  it('should be able to fetch paginated medicines on stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicine = makeMedicine({
      content: 'Medicine x',
    })
    await inMemoryMedicinesRepository.create(medicine)

    await Promise.all(
      Array.from({ length: 22 }).map(async () => {
        const medicineVariant = makeMedicineVariant({
          medicineId: medicine.id,
          pharmaceuticalFormId: pharmaceuticalForm.id,
          unitMeasureId: unitMeasure.id,
        })
        await inMemoryMedicinesVariantsRepository.create(medicineVariant)

        await inMemoryMedicinesRepository.addMedicinesVariantsId(
          medicine.id.toString(),
          medicineVariant.id.toString(),
        )

        const medicineStock = makeMedicineStock({
          medicineVariantId: medicineVariant.id,
          stockId: stock.id,
          currentQuantity: 80,
          createdAt: new Date(2024, 0, 20),
        })
        await inMemoryMedicinesStockRepository.create(medicineStock)
      }),
    )

    const result = await sut.execute({
      page: 2,
      stockId: stock.id.toString(),
      medicineName: 'x',
    })

    expect(result.value?.medicinesStock).toHaveLength(2)
  })
})
