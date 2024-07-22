import { UseCaseError } from '@/core/errors/use-case-error'

export class PackageDeliveryDoesNotExistError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Package delivery does not exist.`)
  }
}
