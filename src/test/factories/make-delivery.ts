import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryProps,
} from '@/domain/fastfeet/enterprise/entities/delivery'
import { PrismaDeliveryMapper } from '@/infra/database/mappers/prisma-delivery-mapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { Injectable } from '@nestjs/common'

export const makeDelivery = (
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) => {
  const delivery = Delivery.create(
    {
      packageId: new UniqueEntityID(),
      destinationAddressId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return delivery
}

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(
    override: Partial<DeliveryProps> = {},
  ): Promise<Delivery> {
    const delivery = makeDelivery(override)

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    })

    return delivery
  }
}
