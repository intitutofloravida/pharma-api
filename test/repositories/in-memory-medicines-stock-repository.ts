import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'

export class InMemoryMedicinesStockRepository
implements MedicinesStockRepository {
  public items: MedicineStock[] = []

  async create(medicinestock: MedicineStock) {
    this.items.push(medicinestock)
  }

  async save(medicinestock: MedicineStock) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === medicinestock.id.toString(),
    )

    if (index === -1) {
      return null
    }

    this.items[index] = medicinestock
  }

  async addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null> {
    const itemIndex = await this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    )

    if (itemIndex === -1) {
      return null
    }

    const medicineStock = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    )

    if (!medicineStock) {
      return null
    }

    medicineStock?.addBatchStockId(new UniqueEntityId(batchStockId))
    this.items[itemIndex] = medicineStock
  }

  async replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId)
    if (!medicineStock) {
      return null
    }

    medicineStock.replenish(Number(quantity))
    await this.save(medicineStock)
    return medicineStock
  }

  async subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId)
    if (!medicineStock) {
      return null
    }

    medicineStock.subtract(Number(quantity))
    await this.save(medicineStock)
    return medicineStock
  }

  async findById(id: string): Promise<MedicineStock | null> {
    const medicinestock = this.items.find((item) => item.id.toString() === id)
    if (!medicinestock) {
      return null
    }

    return medicinestock
  }

  async findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null> {
    const medicinestock = this.items.find(
      (item) =>
        item.medicineVariantId.toString() === medicineVariantId &&
        item.stockId.toString() === stockId,
    )
    if (!medicinestock) {
      return null
    }

    return medicinestock
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicineStockExists = this.items.find((item) => {
      return medicineStock.equals(item)
    })

    if (medicineStockExists) {
      return medicineStockExists
    }

    return null
  }
}
