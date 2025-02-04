import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineVariantNotFoundError extends Error implements UseCaseError {
  constructor(medicinevariantId:string) {
    super(`Variant de medicamento com id ${medicinevariantId} não encontrada!`)
  }
}
