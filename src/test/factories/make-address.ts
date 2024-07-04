import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/fastfeet/enterprise/entities/address'
import { fakerPT_BR } from '@faker-js/faker'

export const makeAddress = (
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) => {
  const address = Address.create(
    {
      city: fakerPT_BR.location.city(),
      zipCode: fakerPT_BR.location.zipCode(),
      uf: fakerPT_BR.location.state(),
      street: fakerPT_BR.location.street(),
      number: Math.round(Math.random() * 500)
        .toString()
        .padStart(3, '0'),
      ...override,
    },
    id,
  )

  return address
}
