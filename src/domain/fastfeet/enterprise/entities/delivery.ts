import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryStatus } from './value-objects/delivery-status'
import { Optional } from '@/core/types/optional'

type DeliveryProps = {
  packageId: UniqueEntityID
  fromAddressId: UniqueEntityID
  toAddressId: UniqueEntityID
  delivererId: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
  status: DeliveryStatus
}

type DeliveryPayload = Optional<DeliveryProps, 'createdAt'>

export class Delivery extends Entity<DeliveryProps> {
  static create(props: DeliveryPayload, id?: UniqueEntityID) {
    return new Delivery(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )
  }

  get packageId() {
    return this.props.packageId
  }

  get fromAddressId() {
    return this.props.fromAddressId
  }

  get toAddressId() {
    return this.props.toAddressId
  }

  get delivererId() {
    return this.props.delivererId
  }

  set delivererId(id: UniqueEntityID | null) {
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
