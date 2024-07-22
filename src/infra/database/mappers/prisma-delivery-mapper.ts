import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'
import { DeliveryStatus } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-status'
import { Delivery as PrismaDelivery, Prisma } from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        packageId: new UniqueEntityID(raw.packageId),
        delivererId: raw.delivererId
          ? new UniqueEntityID(raw.delivererId)
          : null,
        destinationAddressId: new UniqueEntityID(raw.destinationAddressId),
        status: DeliveryStatus.create(raw.status),
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      destinationAddressId: delivery.destinationAddressId.toString(),
      packageId: delivery.packageId.toString(),
      delivererId: delivery.delivererId?.toString(),
      status: delivery.status.current,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
