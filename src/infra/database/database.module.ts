import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaOperatorsRepository } from './prisma/repositories/prisma-operators-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { PrismaTherapeuticClassesRepository } from './prisma/repositories/prisma-therapeutic-classes-repository'
import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { PrismaInstitutionsRepository } from './prisma/repositories/prisma-institution-repository'
import { StocksRepository } from '@/domain/pharma/application/repositories/stocks-repository'
import { PrismaStocksRepository } from './prisma/repositories/prisma-stocks-repositories'
import { PharmaceuticalFormsRepository } from '@/domain/pharma/application/repositories/pharmaceutical-forms-repository'
import { PrismaPharmaceuticalFormsRepository } from './prisma/repositories/prisma-pharmaceutical-form-repository'
import { ManufacturersRepository } from '@/domain/pharma/application/repositories/manufacturers-repository'
import { PrismaManufacturersRepository } from './prisma/repositories/prisma-manufacturers-repository'
import { UnitsMeasureRepository } from '@/domain/pharma/application/repositories/units-measure-repository'
import { PrismaUnitsMeasureRepository } from './prisma/repositories/prisma-unit-measure-repository'

@Module({
  providers: [
    PrismaService,
    { provide: OperatorsRepository, useClass: PrismaOperatorsRepository },
    { provide: TherapeuticClassesRepository, useClass: PrismaTherapeuticClassesRepository },
    { provide: InstitutionsRepository, useClass: PrismaInstitutionsRepository },
    { provide: StocksRepository, useClass: PrismaStocksRepository },
    { provide: PharmaceuticalFormsRepository, useClass: PrismaPharmaceuticalFormsRepository },
    { provide: ManufacturersRepository, useClass: PrismaManufacturersRepository },
    { provide: UnitsMeasureRepository, useClass: PrismaUnitsMeasureRepository },
    PrismaUsersRepository],
  exports: [
    PrismaService,
    OperatorsRepository,
    PrismaUsersRepository,
    TherapeuticClassesRepository,
    InstitutionsRepository,
    StocksRepository,
    PharmaceuticalFormsRepository,
    ManufacturersRepository,
    UnitsMeasureRepository,
  ],
})
export class DatabaseModule {}
