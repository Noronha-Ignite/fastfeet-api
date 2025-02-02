import { UseCaseError } from '@/core/errors/use-case-error'

export class RecipientAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Recipient with identifier "${identifier}" already exists`)
  }
}
