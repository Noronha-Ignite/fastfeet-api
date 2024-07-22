import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/fastfeet/enterprise/entities/address'
import { Address as PrismaAddress, Prisma } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        city: raw.city,
        number: raw.number,
        street: raw.street,
        uf: raw.uf,
        zipCode: raw.zipCode,
        complement: raw.complement,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      city: address.city,
      number: address.number,
      street: address.street,
      uf: address.uf,
      zipCode: address.zipCode,
      complement: address.complement,
      createdAt: address.createdAt,
    }
  }
}
