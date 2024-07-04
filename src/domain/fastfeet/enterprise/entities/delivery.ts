import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryStatus } from './value-objects/delivery-status'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'

type DeliveryProps = {
  packageId: UniqueEntityID
  status: DeliveryStatus
  delivererId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

type DeliveryPayload = Optional<
  DeliveryProps,
  'createdAt' | 'status' | 'delivererId'
>

export class Delivery extends AggregateRoot<DeliveryProps> {
  static create(props: DeliveryPayload, id?: UniqueEntityID) {
    return new Delivery(
      {
        createdAt: new Date(),
        delivererId: null,
        status: DeliveryStatus.create(),
        ...props,
      },
      id,
    )
  }

  get packageId() {
    return this.props.packageId
  }

  get delivererId() {
    return this.props.delivererId
  }

  set delivererId(id: UniqueEntityID | null | undefined) {
    this.delivererId = id

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
    return this.props.status.next()
  }
}
