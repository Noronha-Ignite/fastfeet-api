import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidCpfFormatError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid cpf format.`)
  }
}
