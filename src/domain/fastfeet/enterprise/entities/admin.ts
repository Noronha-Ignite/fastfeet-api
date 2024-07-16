import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type AdminProps = {
  name: string
  cpf: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

type AdminPayload = Optional<AdminProps, 'createdAt'>

export class Admin extends Entity<AdminProps> {
  static create(props: AdminPayload, id?: UniqueEntityID) {
    return new Admin(
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
