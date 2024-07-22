import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/fastfeet/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '@/infra/database/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    override: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(override)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}
