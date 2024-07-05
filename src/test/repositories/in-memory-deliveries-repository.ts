import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  items: Delivery[] = []

  async create(delivery: Delivery): Promise<void> {
    this.items.push(delivery)
  }

  async save(delivery: Delivery): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.id.isEqualTo(delivery.id)) {
        return delivery
      }

      return item
    })
  }

  async findByPackageId(packageId: string): Promise<Delivery | null> {
    return (
      this.items.find((item) => item.packageId.toString() === packageId) ?? null
    )
  }
}
