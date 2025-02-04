import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { BatcheStock as PrismaBatchStock, type Prisma } from '@prisma/client'

export class PrismaBatchStockMapper {
  static toDomain(raw: PrismaBatchStock): BatchStock {
    return BatchStock.create(
      {
        batchId: new UniqueEntityId(raw.batchId),
        currentQuantity: raw.currentQuantity,
        medicineVariantId: new UniqueEntityId(raw.medicineVariantId),
        stockId: new UniqueEntityId(raw.stockId),
        medicineStockId: new UniqueEntityId(raw.medicineStockId),
        lastMove: raw.lastMove,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    batchStock: BatchStock,
  ): Prisma.BatcheStockUncheckedCreateInput {
    return {
      id: batchStock.id.toString(),
      batchId: batchStock.batchId.toString(),
      currentQuantity: batchStock.quantity,
      medicineVariantId: batchStock.medicineVariantId.toString(),
      stockId: batchStock.stockId.toString(),
      medicineStockId: batchStock.medicineStockId.toString(),
      lastMove: batchStock.lastMove,
      createdAt: batchStock.createdAt,
      updatedAt: batchStock.updatedAt,
    }
  }
}
