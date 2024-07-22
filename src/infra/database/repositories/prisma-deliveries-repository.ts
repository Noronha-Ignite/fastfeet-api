import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper'
import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })
  }

  async save(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async findByPackageId(packageId: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        packageId,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async findManyByDelivererId(
    delivererId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const TAKE_BY_PAGE = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        delivererId,
      },
      skip: (page - 1) * TAKE_BY_PAGE,
      take: TAKE_BY_PAGE,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findAllWaitingForPickupByCity(city: string): Promise<Delivery[]> {
    const deliveries = await this.prisma.delivery.findMany({
      where: {
        destinationAddress: {
          city,
        },
      },
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }
}
