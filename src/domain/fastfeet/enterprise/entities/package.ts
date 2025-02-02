import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { randomBytes } from 'crypto'
import { PackageCreatedEvent } from '../events/package-created-event'

export type PackageProps = {
  title: string
  slug: Slug
  deliveredImageUrl?: string | null
  recipientId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

type PackagePayload = Optional<PackageProps, 'createdAt' | 'slug'>

export class Package extends AggregateRoot<PackageProps> {
  static create(props: PackagePayload, id?: UniqueEntityID) {
    const packageCreated = new Package(
      {
        createdAt: new Date(),
        slug: Slug.createFromText(
          props.title.concat('-').concat(randomBytes(4).toString('hex')),
        ),
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

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get deliveredImageUrl() {
    return this.props.deliveredImageUrl
  }

  set deliveredImageUrl(url: string | null | undefined) {
    this.props.deliveredImageUrl = url

    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
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
