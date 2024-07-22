import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type AddressProps = {
  uf: string
  city: string
  street: string
  number: string
  complement?: string | null
  zipCode: string
  createdAt: Date
}

type AddressPayload = Optional<AddressProps, 'createdAt'>

export class Address extends Entity<AddressProps> {
  static create(props: AddressPayload, id?: UniqueEntityID) {
    return new Address(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )
  }

  get uf() {
    return this.props.uf
  }

  get city() {
    return this.props.city
  }

  get zipCode() {
    return this.props.zipCode
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get createdAt() {
    return this.props.createdAt
  }
}
