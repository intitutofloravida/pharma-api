import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BatchFactory } from 'test/factories/make-batch'
import { BatchStockFactory } from 'test/factories/make-batch-stock'
import { InstitutionFactory } from 'test/factories/make-insitution'
import { ManufacturerFactory } from 'test/factories/make-manufacturer'
import { MedicineFactory } from 'test/factories/make-medicine'
import { MedicineEntryFactory } from 'test/factories/make-medicine-entry'
import { MedicineStockFactory } from 'test/factories/make-medicine-stock'
import { MedicineVariantFactory } from 'test/factories/make-medicine-variant'
import { MovementTypeFactory } from 'test/factories/make-movement-type'
import { OperatorFactory } from 'test/factories/make-operator'
import { PatientFactory } from 'test/factories/make-patient'
import { PharmaceuticalFormFactory } from 'test/factories/make-pharmaceutical-form'
import { StockFactory } from 'test/factories/make-stock'
import { TherapeuticClassFactory } from 'test/factories/make-therapeutic-class'
import { UnitMeasureFactory } from 'test/factories/make-unit-measure'

describe('Create Dispensation (E2E)', () => {
  let app: INestApplication
  let manufacturerFactory: ManufacturerFactory
  let patientFactory: PatientFactory
  let institutionFactory: InstitutionFactory
  let stockFactory: StockFactory
  let batchFactory: BatchFactory
  let batchStockFactory: BatchStockFactory
  let medicineStockFactory: MedicineStockFactory
  let medicineVariantFactory: MedicineVariantFactory
  let movementTypeFactory: MovementTypeFactory
  let unitMeasureFactory: UnitMeasureFactory
  let pharmaceuticalFormFactory: PharmaceuticalFormFactory
  let medicineFactory: MedicineFactory
  let therapeuticClassFactory: TherapeuticClassFactory
  let operatorFactory: OperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        OperatorFactory,
        TherapeuticClassFactory,
        MedicineFactory,
        PharmaceuticalFormFactory,
        UnitMeasureFactory,
        InstitutionFactory,
        MedicineVariantFactory,
        StockFactory,
        PatientFactory,
        MedicineEntryFactory,
        BatchStockFactory,
        BatchFactory,
        MedicineStockFactory,
        MovementTypeFactory,
        ManufacturerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    institutionFactory = moduleRef.get(InstitutionFactory)
    manufacturerFactory = moduleRef.get(ManufacturerFactory)
    patientFactory = moduleRef.get(PatientFactory)
    medicineVariantFactory = moduleRef.get(MedicineVariantFactory)
    batchFactory = moduleRef.get(BatchFactory)
    batchStockFactory = moduleRef.get(BatchStockFactory)
    medicineStockFactory = moduleRef.get(MedicineStockFactory)
    stockFactory = moduleRef.get(StockFactory)
    movementTypeFactory = moduleRef.get(MovementTypeFactory)
    unitMeasureFactory = moduleRef.get(UnitMeasureFactory)
    pharmaceuticalFormFactory = moduleRef.get(PharmaceuticalFormFactory)
    medicineFactory = moduleRef.get(MedicineFactory)
    therapeuticClassFactory = moduleRef.get(TherapeuticClassFactory)
    operatorFactory = moduleRef.get(OperatorFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test.only('[POST] /dispensation', async () => {
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

    const patient = await patientFactory.makePrismaPatient()

    const unitMeasure = await unitMeasureFactory.makePrismaUnitMeasure()
    const pharmaceuticalForm =
      await pharmaceuticalFormFactory.makePrismaPharmaceuticalForm()
    const therapeuticClass =
      await therapeuticClassFactory.makePrismaTherapeuticClass()
    const medicine = await medicineFactory.makePrismaMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const medicineVariant = await medicineVariantFactory.makePrismaMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })

    const stock = await stockFactory.makePrismaStock({
      institutionId: institution.id,
    })

    const batch = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id })
    const batch2 = await batchFactory.makePrismaBatch({ manufacturerId: manufacturer.id })

    const medicineStock = await medicineStockFactory.makePrismaMedicineStock({
      batchesStockIds: [],
      currentQuantity: 50,
      stockId: stock.id,
      medicineVariantId: medicineVariant.id,
    })

    const batchStock = await batchStockFactory.makePrismaBatchStock({
      batchId: batch.id,
      currentQuantity: 40,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batchStock2 = await batchStockFactory.makePrismaBatchStock({
      batchId: batch2.id,
      currentQuantity: 10,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    await prisma.medicineStock.update({
      where: {
        id: medicineStock.id.toString(),
      },
      data: {
        batchesStocks: {
          connect: [
            { id: batchStock.id.toString() },
            { id: batchStock2.id.toString() },
          ],
        },
      },
    })

    await movementTypeFactory.makePrismaMovementType({
      content: 'DONATION',
      direction: 'ENTRY',
    })

    const response = await request(app.getHttpServer())
      .post('/dispensation')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        medicineVariantId: medicineVariant.id.toString(),
        stockId: stock.id.toString(),
        patientId: patient.id.toString(),
        batchesStocks: [
          {
            batchStockId: batchStock.id.toString(),
            quantity: 20,
          },
          {
            batchStockId: batchStock2.id.toString(),
            quantity: 5,
          },
        ],
        dispensationDate: new Date(),
      })

    expect(response.statusCode).toBe(201)

    const dispensationOnDatabase = await prisma.dispensation.findFirst({
      where: {
        patientId: patient.id.toString(),
      },
    })

    const quantityOnMedicineStock = await prisma.medicineStock.findFirst()
    const quantityOnBatchStock = await prisma.batcheStock.findUnique({
      where: {
        id: batchStock.id.toString(),
      },
    })
    const quantityOnBatchStock2 = await prisma.batcheStock.findUnique({
      where: {
        id: batchStock2.id.toString(),
      },
    })

    expect(dispensationOnDatabase).toBeTruthy()
    expect(quantityOnBatchStock?.currentQuantity).toEqual(20)
    expect(quantityOnBatchStock2?.currentQuantity).toEqual(5)
    expect(quantityOnMedicineStock?.currentQuantity).toEqual(25)
  })
})
