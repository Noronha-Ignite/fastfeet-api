import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryProps,
} from '@/domain/fastfeet/enterprise/entities/delivery'

export const makeDelivery = (
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) => {
  const delivery = Delivery.create(
    {
      packageId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return delivery
}
