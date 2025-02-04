import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineNotFoundError extends Error implements UseCaseError {
  constructor(medicineId:string) {
    super(`Medicamento com id ${medicineId} não encontrado!`)
  }
}
