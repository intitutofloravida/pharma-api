import { UseCaseError } from '@/core/erros/use-case-error'

export class MovementTypeAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Movement ype with content ${content} already exists `)
  }
}
