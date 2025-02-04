import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { PrismaMedicineStockMapper } from '../mappers/prisma-medicine-stock-mapper'

@Injectable()
export class PrismaMedicinesStockRepository
implements MedicinesStockRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineStock: MedicineStock): Promise<void> {
    await this.prisma.medicineStock.create({
      data: PrismaMedicineStockMapper.toPrisma(medicineStock),
    })
  }

  async save(medicinestock: MedicineStock): Promise<void | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicinestock.id.toString(),
      },
      data: PrismaMedicineStockMapper.toPrisma(medicinestock),
    })

    if (!medicineStock) {
      return null
    }
  }

  async addBatchStock(medicineStockId: string, batchStockId: string): Promise<void | null> {
    await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        batchesStocks: {
          connect: {
            id: batchStockId,
          },
        },
      },
    })
  }

  async replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        currentQuantity: { increment: quantity },
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
  }

  async subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        currentQuantity: { decrement: quantity },

      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
  }

  async findById(id: string): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.findUnique({
      where: {
        id,
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
  }

  async findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.findFirst({
      where: {
        medicineVariantId,
        stockId,
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicinesStock = await this.prisma.medicineStock.findMany({
      where: {
        medicineVariantId: medicineStock.medicineVariantId.toString(),
        stockId: medicineStock.stockId.toString(),
      },
    })

    if (medicinesStock.length > 1) {
      return null
    }

    return medicineStock
  }
}
