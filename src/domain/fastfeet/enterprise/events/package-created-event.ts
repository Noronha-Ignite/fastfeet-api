import { Package } from '../entities/package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

export class PackageCreatedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(public packageCraeted: Package) {
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.packageCraeted.id
  }
}
