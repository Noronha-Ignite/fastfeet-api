import { UseCaseError } from '@/core/errors/use-case-error'
import { DeliveryStatus } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-status'

export class NotAllowedDeliveryStatusError
  extends Error
  implements UseCaseError
{
  constructor(status: DeliveryStatus) {
    super(`Delivery status ${status.current} is not valid for this operation.`)
  }
}
