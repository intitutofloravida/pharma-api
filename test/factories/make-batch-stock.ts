import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  BatchStock,
  BatcheStockProps,
} from '@/domain/pharma/enterprise/entities/batch-stock'
import { PrismaBatchStockMapper } from '@/infra/database/prisma/mappers/prisma-batch-stock-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeBatchStock(
  override: Partial<BatcheStockProps> = {},
  id?: UniqueEntityId,
) {
  const batchstock = BatchStock.create(
    {
      medicineVariantId: new UniqueEntityId(),
      stockId: new UniqueEntityId(),
      batchId: new UniqueEntityId(),
      currentQuantity: 0,
      medicineStockId: new UniqueEntityId(),
      lastMove: faker.date.recent(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  )

  return batchstock
}

@Injectable()
export class BatchStockFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBatchStock(
    data: Partial<BatcheStockProps> = {},
  ): Promise<BatchStock> {
    const batchStock = makeBatchStock(data)
    await this.prisma.batcheStock.create({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
    })

    return batchStock
  }
}
