import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Delivery } from '../entities/delivery'

export class DeliveryStatusChangedEvent implements DomainEvent {
  ocurredAt: Date

  constructor(public delivery: Delivery) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
