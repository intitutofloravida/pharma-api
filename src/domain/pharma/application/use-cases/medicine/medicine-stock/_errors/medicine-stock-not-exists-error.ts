import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineStockNotExistsError extends Error implements UseCaseError {
  constructor(medicineVariantId:string, stockId: string) {
    super(`Não existe a variant ${medicineVariantId} no estoque ${stockId}`)
  }
}
