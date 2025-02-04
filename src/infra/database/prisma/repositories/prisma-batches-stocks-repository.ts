import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { PrismaBatchStockMapper } from '../mappers/prisma-batch-stock-mapper'
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'

@Injectable()
export class PrismaBatchStocksRepository implements BatchStocksRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(batchStock: BatchStock): Promise<void | null> {
    await this.prisma.batcheStock.create({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
    })
  }

  async save(batchStock: BatchStock): Promise<void | null> {
    const batchStockUpdated = await this.prisma.batcheStock.update({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
      where: {
        id: batchStock.id.toString(),
      },
    })

    if (!batchStockUpdated) {
      return null
    }
  }

  async replenish(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.update({
      data: {
        currentQuantity: { increment: quantity },
      },
      where: {
        id: batchStockId,
      },
    })

    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async subtract(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.update({
      data: {
        currentQuantity: { decrement: quantity },
      },
      where: {
        id: batchStockId,
      },
    })
    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findByBatchIdAndStockId(
    batchId: string,
    stockId: string,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.findFirst({
      where: {
        batchId,
        stockId,
      },
    })

    if (!batchStock) {
      return null
    }

    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findById(id: string): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.findUnique({
      where: {
        id,
      },
    })
    if (!batchStock) {
      return null
    }

    return PrismaBatchStockMapper.toDomain(batchStock)
  }
}
