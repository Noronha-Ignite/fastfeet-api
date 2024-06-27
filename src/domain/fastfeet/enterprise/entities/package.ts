import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PackageCreatedEvent } from '../events/package-created-event'

type PackageProps = {
  deliveredImageUrl: string | null
  recipientId: UniqueEntityID
  deliveryId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

type PackagePayload = Optional<PackageProps, 'createdAt'>

export class Package extends AggregateRoot<PackageProps> {
  static create(props: PackagePayload, id?: UniqueEntityID) {
    const packageCreated = new Package(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    const isNew = !id

    if (isNew) {
      packageCreated.addDomainEvent(new PackageCreatedEvent(packageCreated))
    }

    return packageCreated
  }

  get deliveredImageUrl() {
    return this.props.deliveredImageUrl
  }

  set deliveredImageUrl(url: string | null) {
    this.props.deliveredImageUrl = url

    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  get deliveryId() {
    return this.props.deliveryId
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
}
