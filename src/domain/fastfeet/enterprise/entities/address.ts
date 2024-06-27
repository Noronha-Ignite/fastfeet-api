import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type AddressProps = {
  uf: string
  city: string
  street: string
  number: string
  complement?: string
  zipCode: string
}

export class Address extends Entity<AddressProps> {
  static create(props: AddressProps, id?: UniqueEntityID) {
    return new Address(props, id)
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
}
