import { MedicineStock } from '../../enterprise/entities/medicine-stock'

export abstract class MedicinesStockRepository {
  abstract create(medicinestock: MedicineStock): Promise<void>
  abstract save(medicinestock: MedicineStock): Promise<void | null>
  abstract addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null>
  abstract replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>
  abstract subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>
  abstract findById(id: string): Promise<MedicineStock | null>
  abstract findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null>
  abstract medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null>
}
