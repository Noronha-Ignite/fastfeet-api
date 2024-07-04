import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type RecipientProps = {
  name: string
  email: string
  addressId: UniqueEntityID
  createdAt: Date
}

type RecipientPayload = Optional<RecipientProps, 'createdAt'>

export class Recipient extends Entity<RecipientProps> {
  static create(props: RecipientPayload, id?: UniqueEntityID) {
    return new Recipient(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )
  }

  get name() {
    return this.props.name
  }

  get addressId() {
    return this.props.addressId
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }
}
