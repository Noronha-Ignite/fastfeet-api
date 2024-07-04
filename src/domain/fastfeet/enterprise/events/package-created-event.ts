import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Package } from '../entities/package'

export class PackageCreatedEvent implements DomainEvent {
  ocurredAt: Date

  constructor(public packageCreated: Package) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.packageCreated.id
  }
}
