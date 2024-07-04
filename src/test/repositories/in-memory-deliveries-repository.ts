import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/fastfeet/enterprise/entities/delivery'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  items: Delivery[] = []

  async create(delivery: Delivery): Promise<void> {
    this.items.push(delivery)
  }
}
