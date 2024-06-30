import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidRequestError extends Error implements UseCaseError {
  constructor() {
    super('Request not valid.')
  }
}
