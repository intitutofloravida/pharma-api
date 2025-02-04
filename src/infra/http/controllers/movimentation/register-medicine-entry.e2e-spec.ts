import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { addYears, subYears } from 'date-fns'
import request from 'supertest'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineEntryFactory } from 'test/factories/make-medicine-entry'
import { MedicineStockFactory } from 'test/factories/make-medicine-stock'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { MovementTypeFactory } from 'test/factories/make-movement-type'
import { OperatorFactory } from 'test/factories/make-operator'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { StockFactory } from 'test/factories/make-stock'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Register Medicine Entry (E2E)', () => {
  let app: INestApplication
  let manufacturerFactory: ManufacturerFactory
  let institutionFactory: InstitutionFactory
  let stockFactory: StockFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineVariantFactory: MedicineVariantFactory
  let movementTypeFactory: MovementTypeFactory
  let medicineFactory: MedicineFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        MedicineFactory,
        InstitutionFactory,
        TherapeuticClassFactory,
        MedicineVariantFactory,
        StockFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        MedicineEntryFactory,
        MedicineStockFactory,
        MovementTypeFactory,
        ManufacturerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    stockFactory = moduleRef.get(StockFactory)
    movementTypeFactory = moduleRef.get(MovementTypeFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /medicine-entry', async () => {
    const institution = await institutionFactory.makePrismaInstitution()
    const manufacturer = await manufacturerFactory.makePrismaManufacturer()
    const operator = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
      institutionsIds: [institution.id],
    })

    const accessToken = jwt.sign({
      sub: operator.id.toString(),
      role: operator.role,
    })

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()
    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const medicineVariant =
      await medicineVariantFactory.makePrismaMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
      })
    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const movementType = await movementTypeFactory.makePrismaMovementType({
      content: 'DONATION',
      direction: 'ENTRY',
    })

    const response = await request(app.getHttpServer())
      .post(`/medicine-entry/stock/${stock.id.toString()}/medicine-variant/${medicineVariant.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movementTypeId: movementType.id.toString(),
        medicineVariantId: medicineVariant.id.toString(),
        operatorId: operator.id.toString(),
        stockId: stock.id.toString(),
        entryDate: new Date(),
        newBatches: [
          {
            code: 'ABCD1',
            expirationDate: addYears(new Date(), 1),
            manufacturerId: manufacturer.id.toString(),
            manufacturingDate: subYears(new Date(), 1),
            quantityToEntry: 40,
          },
          {
            code: 'ABCD2',
            expirationDate: addYears(new Date(), 1),
            manufacturerId: manufacturer.id.toString(),
            manufacturingDate: subYears(new Date(), 1),
            quantityToEntry: 40,
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const [
      medicineEntryOnDatabase,
      quantityOnMedicineStock,
      quantityOnBatchStock1,
      quantityOnBatchStock2,
    ] = await prisma.$transaction([
      prisma.medicineEntry.findFirst(),
      prisma.medicineStock.findFirst(),
      prisma.batcheStock.findFirst({
        where: {
          batch: {
            code: 'ABCD1',
          },
        },
      }),
      prisma.batcheStock.findFirst({
        where: {
          batch: {
            code: 'ABCD1',
          },
        },
      }),
      prisma.batcheStock.findFirst({
        where: {
          batch: {
            code: 'ABCD2',
          },
        },
      }),
    ])

    expect(medicineEntryOnDatabase).toBeTruthy()
    expect(quantityOnMedicineStock?.currentQuantity).toEqual(80)
    expect(quantityOnBatchStock1?.currentQuantity).toEqual(40)
    expect(quantityOnBatchStock2?.currentQuantity).toEqual(40)
  })
})
