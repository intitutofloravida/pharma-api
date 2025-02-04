import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaOperatorsRepository } from './prisma/repositories/prisma-operators-repository'
import { PrismaPatientsRepository } from './prisma/repositories/prisma-patients-repository'
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
import { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'
import { PrismaPathologysRepository } from './prisma/repositories/prisma-pathology-repository'
import { MedicinesRepository } from '@/domain/pharma/application/repositories/medicines-repository'
import { PrismaMedicinesRepository } from './prisma/repositories/prisma-medicines-repository'
import { MedicinesVariantsRepository } from '@/domain/pharma/application/repositories/medicine-variant-repository'
import { PrismaMedicinesVariantsRepository } from './prisma/repositories/prisma-medicines-variants-repository'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { PrismaMedicinesEntriesRepository } from './prisma/repositories/prisma-medicines-entries-repository'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { PrismaMedicinesStockRepository } from './prisma/repositories/prisma-medicine-stock-repository'
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { PrismaBatchStocksRepository } from './prisma/repositories/prisma-batches-stocks-repository'
import { BatchesRepository } from '@/domain/pharma/application/repositories/batches-repository'
import { PrismaBatchesRepository } from './prisma/repositories/prisma-batches-repository'
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { AddresssRepository } from '@/domain/pharma/application/repositories/address-repository'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository'
import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { PrismaDispensationsMedicinesRepository } from './prisma/repositories/prisma-dispensations-medicines-repository'
import { PrismaMedicinesExitsRepository } from './prisma/repositories/prisma-medicines-exits-repository'
import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import { PrismaMovementTypesRepository } from './prisma/repositories/prisma-movement-type-repository'

@Module({
  providers: [
    PrismaService,
    { provide: OperatorsRepository, useClass: PrismaOperatorsRepository },
    {
      provide: TherapeuticClassesRepository,
      useClass: PrismaTherapeuticClassesRepository,
    },
    { provide: InstitutionsRepository, useClass: PrismaInstitutionsRepository },
    { provide: StocksRepository, useClass: PrismaStocksRepository },
    {
      provide: PharmaceuticalFormsRepository,
      useClass: PrismaPharmaceuticalFormsRepository,
    },
    {
      provide: ManufacturersRepository,
      useClass: PrismaManufacturersRepository,
    },
    { provide: UnitsMeasureRepository, useClass: PrismaUnitsMeasureRepository },
    { provide: PathologiesRepository, useClass: PrismaPathologysRepository },
    { provide: MedicinesRepository, useClass: PrismaMedicinesRepository },
    {
      provide: MedicinesVariantsRepository,
      useClass: PrismaMedicinesVariantsRepository,
    },
    {
      provide: MedicinesEntriesRepository,
      useClass: PrismaMedicinesEntriesRepository,
    },
    {
      provide: MedicinesStockRepository,
      useClass: PrismaMedicinesStockRepository,
    },
    { provide: BatchStocksRepository, useClass: PrismaBatchStocksRepository },
    { provide: BatchesRepository, useClass: PrismaBatchesRepository },
    { provide: PatientsRepository, useClass: PrismaPatientsRepository },
    { provide: AddresssRepository, useClass: PrismaAddressRepository },
    { provide: MedicinesExitsRepository, useClass: PrismaMedicinesExitsRepository },
    { provide: DispensationsMedicinesRepository, useClass: PrismaDispensationsMedicinesRepository },
    { provide: MovementTypesRepository, useClass: PrismaMovementTypesRepository },
  ],
  exports: [
    PrismaService,
    OperatorsRepository,
    TherapeuticClassesRepository,
    InstitutionsRepository,
    StocksRepository,
    PharmaceuticalFormsRepository,
    ManufacturersRepository,
    UnitsMeasureRepository,
    PathologiesRepository,
    MedicinesRepository,
    MedicinesVariantsRepository,
    MedicinesEntriesRepository,
    MedicinesStockRepository,
    BatchStocksRepository,
    BatchesRepository,
    PatientsRepository,
    AddresssRepository,
    MedicinesExitsRepository,
    DispensationsMedicinesRepository,
    MovementTypesRepository,
  ],
})
export class DatabaseModule {}
