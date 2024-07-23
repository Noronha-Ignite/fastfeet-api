import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryDetails } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-details'
import { DeliveryStatus } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-status'
import { Slug } from '@/domain/fastfeet/enterprise/entities/value-objects/slug'
import {
  Delivery as PrismaDelivery,
  Address as PrismaAddress,
  Package as PrismaPackage,
  Recipient as PrismaRecipient,
} from '@prisma/client'

type PrismaDeliveryWithDestinationAndPackage = PrismaDelivery & {
  destinationAddress: PrismaAddress
  package: PrismaPackage & {
    recipient: PrismaRecipient
  }
}

export class PrismaDeliveryDetailsMapper {
  static toDomain(
    raw: PrismaDeliveryWithDestinationAndPackage,
  ): DeliveryDetails {
    return DeliveryDetails.create({
      deliveryId: new UniqueEntityID(raw.id),
      status: DeliveryStatus.create(raw.status),
      destination: raw.destinationAddress,
      package: {
        title: raw.package.title,
        slug: Slug.create(raw.package.slug),
        recipient: {
          name: raw.package.recipient.name,
          email: raw.package.recipient.email,
        },
      },
    })
  }
}
