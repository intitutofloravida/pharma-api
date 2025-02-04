import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BatchesRepository } from '@/domain/pharma/application/repositories/batches-repository'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'
import { PrismaBatchMapper } from '../mappers/prisma-batch-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaBatchesRepository implements BatchesRepository {
  constructor(private prisma: PrismaService) {}

  async create(batch: Batch): Promise<void> {
    await this.prisma.batch.create({
      data: PrismaBatchMapper.toPrisma(batch),
    })
  }

  async findById(id: string): Promise<Batch | null> {
    const batch = await this.prisma.batch.findUnique({
      where: {
        id,
      },
    })

    if (!batch) {
      return null
    }

    return PrismaBatchMapper.toDomain(batch)
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ batches: Batch[]; meta: Meta }> {
    const batches = await this.prisma.batch.findMany({
      where: {
        code: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const batchesTotalCount = await this.prisma.batch.count({
      where: {
        code: content ?? '',
      },
    })

    return {
      batches: batches.map(PrismaBatchMapper.toDomain),
      meta: {
        page,
        totalCount: batchesTotalCount,
      },
    }
  }

  async findManyByManufacturerId({ page }: PaginationParams, manufactrurerId: string): Promise<{ batches: Batch[]; meta: Meta }> {
    const whereClause = {
      id: manufactrurerId,
    }

    const [batches, batchesTotalCount] = await this.prisma.$transaction([
      this.prisma.batch.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        skip: (page - 1) * 20,
      }),
      this.prisma.batch.count({
        where: whereClause,
      }),
    ])

    return {
      batches: batches.map(PrismaBatchMapper.toDomain),
      meta: {
        page,
        totalCount: batchesTotalCount,
      },
    }
  }
}
