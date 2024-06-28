import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidEmailFormatError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid email format.`)
  }
}
