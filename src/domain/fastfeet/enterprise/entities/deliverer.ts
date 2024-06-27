import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

type DelivererProps = {
  name: string
  cpf: string
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

  get cpf() {
    return this.props.cpf
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
