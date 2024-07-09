import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'
import { InMemoryAddressesRepository } from './in-memory-addresses-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  items: Delivery[] = []

  constructor(private addressesRepository: InMemoryAddressesRepository) {}

  async create(delivery: Delivery): Promise<void> {
    this.items.push(delivery)

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async save(delivery: Delivery): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.id.isEqualTo(delivery.id)) {
        return delivery
      }

      return item
    })

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async findByPackageId(packageId: string): Promise<Delivery | null> {
    return (
      this.items.find((item) => item.packageId.toString() === packageId) ?? null
    )
  }

  async findManyByDelivererId(
    delivererId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const TAKE_PER_PAGE = 20

    const items = this.items
      .filter((item) => item.delivererId?.toString() === delivererId)
      .slice((page - 1) * TAKE_PER_PAGE, page * TAKE_PER_PAGE)

    return items
  }

  async findAllWaitingForPickupByCity(city: string): Promise<Delivery[]> {
    const itemsWithAddresses = await Promise.all(
      this.items.map(async (item) => ({
        delivery: item,
        address: await this.addressesRepository.findById(
          item.destinationAddressId.toString(),
        ),
      })),
    )

    const data = itemsWithAddresses
      .filter((item) => item.address?.city === city)
      .map((item) => item.delivery)

    return data
  }
}
