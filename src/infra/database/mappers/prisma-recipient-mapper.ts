import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        email: raw.email,
        name: raw.name,
        addressId: new UniqueEntityID(raw.addressId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      email: recipient.email,
      name: recipient.name,
      createdAt: recipient.createdAt,
      addressId: recipient.addressId.toString(),
    }
  }
}
