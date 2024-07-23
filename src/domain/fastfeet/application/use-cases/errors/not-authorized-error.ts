import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAuthorizedError extends Error implements UseCaseError {
  constructor() {
    super(`Current user is not authorized to do this operation.`)
  }
}
