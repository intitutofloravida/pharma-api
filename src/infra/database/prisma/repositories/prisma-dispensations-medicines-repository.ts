import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDispensationMapper } from '../mappers/prisma-dispensation-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaMedicineExitMapper } from '../mappers/prisma-medicine-exit-mapper'

@Injectable()
export class PrismaDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  constructor(private prisma: PrismaService) {}

  async create(dispensation: Dispensation): Promise<void> {
    const data = PrismaDispensationMapper.toPrisma(dispensation)
    await this.prisma.dispensation.create({
      data,
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: { patientId?: string },
  ): Promise<{ dispensations: Dispensation[]; meta: Meta }> {
    const { patientId } = filters
    const whereClause = {
      patientId,
    }

    const [dispensations, totalCount] = await this.prisma.$transaction([
      this.prisma.dispensation.findMany({
        where: whereClause,
        take: 20,
        skip: (page - 1) * 20,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          exitRecords: true,
        },
      }),
      this.prisma.dispensation.count({
        where: whereClause,
        take: 20,
        skip: (page - 1) * 20,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    const dispensationsMapped = dispensations.map(dispensation => {
      const exitsMapped = dispensation.exitRecords.map(exit => {
        return PrismaMedicineExitMapper.toDomain(exit)
      })

      return PrismaDispensationMapper.toDomain({
        ...dispensation,
        exitRecords: exitsMapped,
      })
    })

    return {
      dispensations: dispensationsMapped,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
