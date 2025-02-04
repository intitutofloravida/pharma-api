import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { MedicineExit } from '@/domain/pharma/enterprise/entities/exit'
import { Dispensation as PrismaDispensation, type Prisma } from '@prisma/client'

export class PrismaDispensationMapper {
  static toDomain(raw: PrismaDispensation & { exitRecords: MedicineExit[] }): Dispensation {
    return Dispensation.create(
      {
        operatorId: new UniqueEntityId(raw.operatorId),
        exitsRecords: raw.exitRecords,
        patientId: new UniqueEntityId(raw.patientId),
        dispensationDate: raw.dispensationDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    dispensation: Dispensation,
  ): Prisma.DispensationUncheckedCreateInput {
    return {
      id: dispensation.id.toString(),
      dispensationDate: dispensation.dispensationDate,
      patientId: dispensation.patientId.toString(),
      operatorId: dispensation.operatorId.toString(),
      exitRecords: {
        connect: dispensation.exitsRecords.map(exit => ({ id: exit.id.toString() })),
      },
      createdAt: dispensation.createdAt,
      updatedAt: dispensation.updatedAt,
    }
  }
}
