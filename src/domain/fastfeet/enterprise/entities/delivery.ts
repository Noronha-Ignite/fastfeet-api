import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryStatus } from './value-objects/delivery-status'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DeliveryStatusChangedEvent } from '../events/delivery-status-changed-event'

export type DeliveryProps = {
  packageId: UniqueEntityID
  status: DeliveryStatus
  delivererId?: UniqueEntityID | null
  destinationAddressId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

type DeliveryPayload = Optional<
  DeliveryProps,
  'createdAt' | 'status' | 'delivererId'
>

export class Delivery extends AggregateRoot<DeliveryProps> {
  static create(props: DeliveryPayload, id?: UniqueEntityID) {
    const delivery = new Delivery(
      {
        createdAt: new Date(),
        delivererId: null,
        status: DeliveryStatus.create(),
        ...props,
      },
      id,
    )

    delivery.addDomainEvent(new DeliveryStatusChangedEvent(delivery))

    return delivery
  }

  get packageId() {
    return this.props.packageId
  }

  get delivererId() {
    return this.props.delivererId
  }

  get destinationAddressId() {
    return this.props.destinationAddressId
  }

  set delivererId(id: UniqueEntityID | null | undefined) {
    this.props.delivererId = id

    if (this.status.current === 'WAITING_FOR_PICKUP') {
      this.nextStatus()
    }

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get status() {
    return this.props.status
  }

  public nextStatus() {
    this.addDomainEvent(new DeliveryStatusChangedEvent(this))

    return this.props.status.next()
  }
}
