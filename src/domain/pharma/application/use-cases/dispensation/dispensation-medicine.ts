import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { InsufficientQuantityInStockError } from '../_errors/insufficient-quantity-in-stock-error'
import { InsufficientQuantityBatchInStockError } from '../_errors/insufficient-quantity-batch-in-stock-error'
import { MedicineExit } from '../../../enterprise/entities/exit'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { Dispensation } from '../../../enterprise/entities/dispensation'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { ExpiredMedicineDispenseError } from '../_errors/expired-medicine-dispense-error'
import { Injectable } from '@nestjs/common'
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository'
import { MedicinesVariantsRepository } from '../../repositories/medicine-variant-repository'

interface DispensationMedicineUseCaseRequest {
  medicineVariantId: string;
  stockId: string;
  patientId: string;
  operatorId: string;
  batchesStocks: { batchStockId: string, quantity: number }[];
  dispensationDate?: Date;
}

type DispensationMedicineUseCaseResponse = Either<
  | ResourceNotFoundError
  | InsufficientQuantityInStockError
  | NoBatchInStockFoundError
  | InsufficientQuantityBatchInStockError
  | ExpiredMedicineDispenseError,
  {
    dispensation: Dispensation;
  }
>

@Injectable()
export class DispensationMedicineUseCase {
  constructor(
    private dispensationsMedicinesRepository: DispensationsMedicinesRepository,
    private medicinesExitsRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchestockskRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({
    medicineVariantId,
    stockId,
    patientId,
    operatorId,
    batchesStocks,
    dispensationDate,
  }: DispensationMedicineUseCaseRequest): Promise<DispensationMedicineUseCaseResponse> {
    const medicineVariant =
      await this.medicinesVariantsRepository.findById(medicineVariantId)
    if (!medicineVariant) {
      return left(new ResourceNotFoundError())
    }
    const medicine = await this.medicinesRepository.findById(
      medicineVariant.medicineId.toString(),
    )
    if (!medicine) {
      return left(new ResourceNotFoundError())
    }
    const medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        medicineVariantId,
        stockId,
      )
    if (!medicineStock) {
      console.log('')
      return left(new NoBatchInStockFoundError(medicine?.content))
    }

    let totalQuantityToDispense = 0

    for (const item of batchesStocks) {
      const batchestock = await this.batchestockskRepository.findById(
        item.batchStockId,
      )
      if (!batchestock) {
        return left(new ResourceNotFoundError())
      }

      const batch = await this.batchesRepository.findById(
        batchestock.batchId.toString(),
      )
      if (!batch) {
        return left(new ResourceNotFoundError())
      }

      const expirationDate = new Date(batch.expirationDate)

      if (expirationDate <= new Date()) {
        return left(
          new ExpiredMedicineDispenseError(batch.code, medicine.content),
        )
      }

      if (batchestock.quantity < item.quantity) {
        return left(
          new InsufficientQuantityBatchInStockError(
            medicine.content,
            batch.code,
            batchestock.quantity,
          ),
        )
      }

      totalQuantityToDispense += item.quantity
    }

    if (medicineStock.quantity < totalQuantityToDispense) {
      return left(
        new InsufficientQuantityInStockError(
          medicine.content,
          medicineStock.quantity,
        ),
      )
    }
    const exitsRecords: MedicineExit[] = []

    for (const item of batchesStocks) {
      const medicineExit = MedicineExit.create({
        medicineStockId: medicineStock.id,
        batchestockId: new UniqueEntityId(item.batchStockId),
        exitDate: dispensationDate,
        exitType: 'DISPENSATION',
        quantity: item.quantity,
        operatorId: new UniqueEntityId(operatorId),
      })

      exitsRecords.push(medicineExit)

      await Promise.all([
        this.medicinesExitsRepository.create(medicineExit),
        this.batchestockskRepository.subtract(
          item.batchStockId.toString(),
          item.quantity,
        ),
        this.medicinesStockRepository.subtract(
          medicineStock.id.toString(),
          item.quantity,
        ),
      ])
    }

    const dispensation = Dispensation.create({
      patientId: new UniqueEntityId(patientId),
      dispensationDate,
      exitsRecords,
      operatorId: new UniqueEntityId(operatorId),
    })

    await this.dispensationsMedicinesRepository.create(dispensation)

    return right({ dispensation })
  }
}
