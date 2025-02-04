import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { MedicineEntry as PrismaMedicineEntry, type Prisma } from '@prisma/client'

export class PrismaMedicineEntryMapper {
  static toDomain(raw: PrismaMedicineEntry): MedicineEntry {
    return MedicineEntry.create({
      operatorId: new UniqueEntityId(raw.operatorId),
      batcheStockId: new UniqueEntityId(raw.batchStockId),
      medicineStockId: new UniqueEntityId(raw.medicineStockId),
      movementTypeId: new UniqueEntityId(raw.movementTypeId),
      quantity: raw.quantity,
      entryDate: raw.entryDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicineEntry: MedicineEntry): Prisma.MedicineEntryUncheckedCreateInput {
    return {
      id: medicineEntry.id.toString(),
      batchStockId: medicineEntry.batcheStockId.toString(),
      medicineStockId: medicineEntry.medicineStockId.toString(),
      movementTypeId: medicineEntry.movementTypeId.toString(),
      operatorId: medicineEntry.operatorId.toString(),
      quantity: medicineEntry.quantity,
      entryDate: medicineEntry.entryDate,
      createdAt: medicineEntry.createdAt,
      updatedAt: medicineEntry.updatedAt,
    }
  }
}
