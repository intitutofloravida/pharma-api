import { PharmaceuticalForm } from '../../enterprise/entities/pharmaceutical-form'

export abstract class PharmaceuticalFormsRepository {
  abstract create(pharmaceuticalForm: PharmaceuticalForm): Promise<void>
  abstract findByContent(content: string): Promise<PharmaceuticalForm | null>
}
