import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import { MovementType } from '@/domain/pharma/enterprise/entities/movement-type'
import { PrismaMovementTypeMapper } from '../mappers/prisma-movement-type-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaMovementTypesRepository implements MovementTypesRepository {
  constructor(private prisma: PrismaService) {}
  async findByContent(content: string): Promise<MovementType | null> {
    const movementType = await this.prisma.movementType.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },
    })

    if (!movementType) {
      return null
    }

    return PrismaMovementTypeMapper.toDomain(movementType)
  }

  async create(movementType: MovementType): Promise<void> {
    const data = PrismaMovementTypeMapper.toPrisma(movementType)
    await this.prisma.movementType.create({
      data,
    })
  }
}
