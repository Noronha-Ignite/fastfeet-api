import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type DelivererProps = {
  name: string
  cpf: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

type DelivererPayload = Optional<DelivererProps, 'createdAt'>

export class Deliverer extends Entity<DelivererProps> {
  static create(props: DelivererPayload, id?: UniqueEntityID) {
    return new Deliverer(
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

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password

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
}
