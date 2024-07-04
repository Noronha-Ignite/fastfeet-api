import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/fastfeet/enterprise/entities/recipient'
import { faker } from '@faker-js/faker'

export const makeRecipient = (
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) => {
  const recipient = Recipient.create(
    {
      addressId: new UniqueEntityID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  )

  return recipient
}
