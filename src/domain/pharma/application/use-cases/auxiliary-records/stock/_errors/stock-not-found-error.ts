import { UseCaseError } from '@/core/erros/use-case-error'

export class StockNotFoundError extends Error implements UseCaseError {
  constructor(stockId:string) {
    super(`Estoque com id ${stockId} não encontrado!`)
  }
}
