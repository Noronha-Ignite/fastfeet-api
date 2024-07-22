import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/fastfeet/enterprise/entities/address'
import { PrismaAddressMapper } from '@/infra/database/mappers/prisma-address-mapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { fakerPT_BR } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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
      createdAt: new Date(),
    },
    id,
  )

  return address
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(
    override: Partial<AddressProps> = {},
  ): Promise<Address> {
    const address = makeAddress(override)

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })

    return address
  }
}
