import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAddressError extends Error implements UseCaseError {
  constructor() {
    super(`Address given is not valid.`)
  }
}
