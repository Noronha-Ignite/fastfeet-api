import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryAlreadyPickedError extends Error implements UseCaseError {
  constructor() {
    super(`Delivery has already been picked.`)
  }
}
