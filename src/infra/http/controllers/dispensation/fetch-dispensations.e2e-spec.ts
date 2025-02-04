import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OperatorFactory } from 'test/factories/make-operator'
import { DispensationFactory } from 'test/factories/make-dispensation'
import { PatientFactory } from 'test/factories/make-patient'
import { addDays } from 'date-fns'

describe('Fetch Dispensations (E2E)', () => {
  let app: INestApplication
  let patientFactory: PatientFactory
  let operatorFactory: OperatorFactory
  let dispensationFactory: DispensationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DispensationFactory, OperatorFactory, PatientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    patientFactory = moduleRef.get(PatientFactory)

    operatorFactory = moduleRef.get(OperatorFactory)
    dispensationFactory = moduleRef.get(DispensationFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /dispensations', async () => {
    const user = await operatorFactory.makePrismaOperator({
      role: 'MANAGER',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const patient =
      await patientFactory.makePrismaPatient()

    await Promise.all([
      dispensationFactory.makePrismaDispensation({
        dispensationDate: new Date(2025, 0, 1),
        patientId: patient.id,
        operatorId: user.id,
      }),
      dispensationFactory.makePrismaDispensation({
        dispensationDate: addDays(new Date(2025, 0, 1), 1),
        patientId: patient.id,
        operatorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/dispensations')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        patientId: patient.id.toString(),
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.dispensations).toHaveLength(2)
  })
})
