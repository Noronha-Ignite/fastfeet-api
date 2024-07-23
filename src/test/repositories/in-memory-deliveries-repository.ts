import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'
import { InMemoryAddressesRepository } from './in-memory-addresses-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { DeliveryDetails } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-details'
import { InMemoryPackagesRepository } from './in-memory-packages-repository'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  items: Delivery[] = []

  constructor(
    private addressesRepository: InMemoryAddressesRepository,
    private packagesRepository: InMemoryPackagesRepository,
    private recipientsRepository: InMemoryRecipientsRepository,
  ) {}

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
  ): Promise<DeliveryDetails[]> {
    const TAKE_PER_PAGE = 20

    const items = this.items
      .filter((item) => item.delivererId?.toString() === delivererId)
      .slice((page - 1) * TAKE_PER_PAGE, page * TAKE_PER_PAGE)

    return items.map<DeliveryDetails>((item) => {
      const itemAddress = this.addressesRepository.items.find((address) =>
        address.id.isEqualTo(item.destinationAddressId),
      )

      const itemPackage = this.packagesRepository.items.find(
        (packageSearched) => item.packageId.isEqualTo(packageSearched.id),
      )

      const itemRecipient = this.recipientsRepository.items.find((recipient) =>
        recipient.id.isEqualTo(itemPackage?.recipientId),
      )

      if (!itemAddress || !itemPackage || !itemRecipient) {
        throw new Error()
      }

      return DeliveryDetails.create({
        status: item.status,
        deliveryId: item.id,
        destination: {
          city: itemAddress.city,
          number: itemAddress.number,
          street: itemAddress.street,
          uf: itemAddress.uf,
          zipCode: itemAddress.zipCode,
          complement: itemAddress.complement,
        },
        package: {
          title: itemPackage.title,
          slug: itemPackage.slug,
          recipient: {
            name: itemRecipient.name,
            email: itemRecipient.email,
          },
        },
      })
    })
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
