import { DomainEvents } from '@/core/events/domain-events'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { Package } from '@/domain/fastfeet/enterprise/entities/package'

export class InMemoryPackagesRepository implements PackagesRepository {
  items: Package[] = []

  async create(recipientPackage: Package): Promise<void> {
    this.items.push(recipientPackage)

    DomainEvents.dispatchEventsForAggregate(recipientPackage.id)
  }

  async save(recipientPackage: Package): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.id.isEqualTo(recipientPackage.id)) {
        return recipientPackage
      }

      return item
    })

    DomainEvents.dispatchEventsForAggregate(recipientPackage.id)
  }

  async findById(id: string): Promise<Package | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }
}
