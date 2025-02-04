import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineStockNotFoundError extends Error implements UseCaseError {
  constructor(medicineStockId:string) {
    super(`Estoque de medicamento com id ${medicineStockId} não encontrado!`)
  }
}
