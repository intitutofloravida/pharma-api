import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { PrismaMedicineEntryMapper } from '../mappers/prisma-medicine-entry-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import { PrismaMedicineEntryWithMedicineVariantAndBatchMapper } from '../mappers/prisma-medicine-entry-with-medicine-variant-and-bath'

@Injectable()
export class PrismaMedicinesEntriesRepository
implements MedicinesEntriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineEntry: MedicineEntry): Promise<void> {
    await this.prisma.medicineEntry.create({
      data: PrismaMedicineEntryMapper.toPrisma(medicineEntry),
    })
  }

  async findManyByInstitutionId(
    { page }: PaginationParams,
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    medicineId?: string,
    medicineVariantId?: string,
  ): Promise<{
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[];
    meta: Meta;
  }> {
    const medicinesEntriesFiltered = await this.prisma.medicineEntry.findMany({
      where: {
        batcheStock: {
          stock: {
            ...(stockId && { id: stockId }),
            institutionId,
          },
          medicineVariant: {
            ...(medicineId && { medicineId }),
            ...(medicineVariantId && { id: medicineVariantId }),
          },
        },
        ...(operatorId && { operatorId }),
      },
      include: {
        batcheStock: {
          include: {
            batch: true,
          },
        },
        medicineStock: {
          include: {
            medicineVariant: {
              include: {
                medicine: true,
                unitMeasure: true,
                pharmaceuticalForm: true,
              },
            },
            stock: true,
          },
        },
        operator: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const medicinesEntriesFilteredCount = await this.prisma.medicineEntry.count({
      where: {
        batcheStock: {
          stock: {
            institutionId,
          },
        },
      },
    })

    const medicinesEntriesFilteredMapped = medicinesEntriesFiltered.map(item => {
      return PrismaMedicineEntryWithMedicineVariantAndBatchMapper.toDomain({
        batch: item.batcheStock.batch,
        batchStockId: item.batchStockId,
        medicine: item.medicineStock.medicineVariant.medicine,
        createdAt: item.createdAt,
        entryDate: item.entryDate,
        id: item.id,
        medicineStockId: item.medicineStockId,
        medicineVariant: item.medicineStock.medicineVariant,
        movementTypeId: item.movementTypeId,
        operator: item.operator,
        operatorId: item.operatorId,
        pharmaceuticalForm: item.medicineStock.medicineVariant.pharmaceuticalForm,
        quantity: item.quantity,
        stock: item.medicineStock.stock,
        unitMeasure: item.medicineStock.medicineVariant.unitMeasure,
        updatedAt: item.createdAt,
      })
    })

    return {
      medicinesEntries: medicinesEntriesFilteredMapped,
      meta: {
        page,
        totalCount: medicinesEntriesFilteredCount,
      },
    }
  }
}
