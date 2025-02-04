import { PrismaClient, OperatorRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function clearDatabase() {
  await prisma.medicineTherapeuticClass.deleteMany()
  await prisma.medicineEntry.deleteMany()
  await prisma.batcheStock.deleteMany()
  await prisma.medicineStock.deleteMany()
  await prisma.medicineVariant.deleteMany()
  await prisma.therapeuticClass.deleteMany()
  await prisma.medicine.deleteMany()
  await prisma.pharmaceuticalForm.deleteMany()
  await prisma.unitMeasure.deleteMany()
  await prisma.pathology.deleteMany()
  await prisma.batch.deleteMany()
  await prisma.manufacturer.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.operator.deleteMany()
  await prisma.institution.deleteMany()
  await prisma.movementType.deleteMany()
}

async function main() {
  await clearDatabase()

  const institution = await prisma.institution.create({
    data: {
      name: 'Instituto Flora Vida',
      cnpj: '01.234.567/0001-89',
      description: '',
    },
  })
  const institution2 = await prisma.institution.create({
    data: {
      name: 'Ubs - módulo 20',
      cnpj: '01.234.567/0001-10',
      description: '',
    },
  })
  await prisma.institution.create({
    data: {
      name: 'Ubs - módulo 15',
      cnpj: '01.234.567/0001-20',
      description: '',
    },
  })

  await prisma.operator.createMany({
    data: [
      {
        name: 'Instituto Flora Vida',
        email: 'floravida@gmail.com',
        passwordHash: await hash('12345678', 8),
        role: OperatorRole.SUPER_ADMIN,
      },
      {
        name: 'Carlos Pereira',
        email: 'carlos.pereira@biovida.com',
        passwordHash: await hash('12345678', 8),
        role: OperatorRole.COMMON,
      },
    ],
  })

  await prisma.operator.create({
    data: {
      name: 'Yuri Sousa',
      email: 'yurisousaenfer@gmail.com',
      passwordHash: await hash('12345678', 8),
      role: OperatorRole.MANAGER,
      institutions: {
        connect: {
          id: institution.id,
        },
      },
    },
  })

  await prisma.stock.createMany({
    data: [
      { name: 'stock 01', institutionId: institution.id },
      { name: 'stock 02', institutionId: institution2.id },
      { name: 'stock 03', institutionId: institution.id },
    ],
  })

  await prisma.manufacturer.createMany({
    data: [
      {
        name: 'Medley',
        cnpj: '11111111111111',
        description: 'Fabricante de medicamentos genéricos.',
      },
      {
        name: 'Eurofarma',
        cnpj: '22222222222222',
        description: 'Líder em medicamentos no Brasil.',
      },
      {
        name: 'Pfizer',
        cnpj: '33333333333333',
        description: 'Empresa global de biotecnologia.',
      },
      {
        name: 'Aché',
        cnpj: '44444444144',
        description: 'Especializada em medicamentos e suplementos.',
      },
      {
        name: 'EMS',
        cnpj: '55555555000155',
        description: 'Maior farmacêutica brasileira.',
      },
    ],
  })

  await prisma.pathology.createMany({
    data: [
      { name: 'Hipertensão Arterial' },
      { name: 'Diabetes Mellitus' },
      { name: 'Infecção do Trato Urinário' },
      { name: 'Gripe' },
      { name: 'Dengue' },
      { name: 'Infecção de Garganta' },
      { name: 'Cefaleia (Dor de Cabeça)' },
      { name: 'Asma' },
      { name: 'Bronquite' },
      { name: 'Dermatite de Contato' },
      { name: 'Sinusite' },
      { name: 'Otite Média' },
      { name: 'Conjuntivite' },
      { name: 'Gastrite' },
      { name: 'Obesidade' },
      { name: 'Anemia Ferropriva' },
      { name: 'Síndrome do Intestino Irritável' },
      { name: 'Depressão' },
      { name: 'Ansiedade' },
      { name: 'Hipotireoidismo' },
      { name: 'Insônia' },
      { name: 'Artrite Reumatoide' },
      { name: 'Herpes Zoster' },
      { name: 'Viroses Respiratórias' },
      { name: 'Candidíase Vaginal' },
    ],
  })

  const unitMeasureMg = await prisma.unitMeasure.create({
    data: {
      name: 'miligrama',
      acronym: 'mg',
    },
  })

  const unitMeasureMl = await prisma.unitMeasure.create({
    data: {
      name: 'mililitro',
      acronym: 'ml',
    },
  })

  const pharmaceuticalFormComprimido = await prisma.pharmaceuticalForm.create({
    data: {
      name: 'Comprimido',
    },
  })

  const pharmaceuticalFormCapsula = await prisma.pharmaceuticalForm.create({
    data: {
      name: 'Cápsula',
    },
  })

  const medicine1 = await prisma.medicine.create({
    data: {
      name: 'Paracetamol',
    },
  })

  const therapeuticClasse01 = await prisma.therapeuticClass.create({
    data: {
      name: 'Analgésicos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine1.id,
      therapeuticClassId: therapeuticClasse01.id,
    },
  })

  await prisma.movementType.createMany(
    {
      data: [{
        name: 'DONATION',
        direction: 'ENTRY',
      }],
    },
  )

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMl.id,
      },
      {
        dosage: '750',
        medicineId: medicine1.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMl.id,
      },
    ],
  })

  const medicine2 = await prisma.medicine.create({
    data: {
      name: 'Ibuprofeno',
    },
  })

  const therapeuticClasse02 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anti-inflamatórios',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine2.id,
      therapeuticClassId: therapeuticClasse02.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '200',
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '400',
        medicineId: medicine2.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine3 = await prisma.medicine.create({
    data: {
      name: 'Amoxicilina',
    },
  })

  const therapeuticClasse03 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antibióticos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine3.id,
      therapeuticClassId: therapeuticClasse03.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine3.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '750',
        medicineId: medicine3.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine4 = await prisma.medicine.create({
    data: {
      name: 'Fluconazol',
    },
  })

  const therapeuticClasse04 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antifúngicos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine4.id,
      therapeuticClassId: therapeuticClasse04.id,
    },
  })
  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '150',
        medicineId: medicine4.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '300',
        medicineId: medicine4.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine5 = await prisma.medicine.create({
    data: {
      name: 'Oseltamivir',
    },
  })

  const therapeuticClasse05 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antivirais',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine5.id,
      therapeuticClassId: therapeuticClasse05.id,
    },
  })
  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '75',
        medicineId: medicine5.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '150',
        medicineId: medicine5.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine6 = await prisma.medicine.create({
    data: {
      name: 'Losartana',
    },
  })

  const therapeuticClasse06 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anti-hipertensivos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine6.id,
      therapeuticClassId: therapeuticClasse06.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '50',
        medicineId: medicine6.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '100',
        medicineId: medicine6.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine7 = await prisma.medicine.create({
    data: {
      name: 'Metformina',
    },
  })

  const therapeuticClasse07 = await prisma.therapeuticClass.create({
    data: {
      name: 'Hipoglicemiantes',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine7.id,
      therapeuticClassId: therapeuticClasse07.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '500',
        medicineId: medicine7.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '850',
        medicineId: medicine7.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine8 = await prisma.medicine.create({
    data: {
      name: 'Varfarina',
    },
  })

  const therapeuticClasse08 = await prisma.therapeuticClass.create({
    data: {
      name: 'Anticoagulantes',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine8.id,
      therapeuticClassId: therapeuticClasse08.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '2.5',
        medicineId: medicine8.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '5',
        medicineId: medicine8.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine9 = await prisma.medicine.create({
    data: {
      name: 'Diazepam',
    },
  })

  const therapeuticClasse09 = await prisma.therapeuticClass.create({
    data: {
      name: 'Ansiolíticos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine9.id,
      therapeuticClassId: therapeuticClasse09.id,
    },
  })

  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '5',
        medicineId: medicine9.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '10',
        medicineId: medicine9.id,
        pharmaceuticalFormId: pharmaceuticalFormComprimido.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })

  const medicine10 = await prisma.medicine.create({
    data: {
      name: 'Fluoxetina',
    },
  })

  const therapeuticClasse010 = await prisma.therapeuticClass.create({
    data: {
      name: 'Antidepressivos',
    },
  })

  await prisma.medicineTherapeuticClass.create({
    data: {
      medicineId: medicine10.id,
      therapeuticClassId: therapeuticClasse010.id,
    },
  })
  await prisma.medicineVariant.createMany({
    data: [
      {
        dosage: '20',
        medicineId: medicine10.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
      {
        dosage: '40',
        medicineId: medicine10.id,
        pharmaceuticalFormId: pharmaceuticalFormCapsula.id,
        unitMeasureId: unitMeasureMg.id,
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
