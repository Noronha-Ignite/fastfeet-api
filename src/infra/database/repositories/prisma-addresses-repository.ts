import { AddressesRepository } from '@/domain/fastfeet/application/repositories/address-repository'
import { Address } from '@/domain/fastfeet/enterprise/entities/address'
import { PrismaService } from '../prisma.service'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.create({
      data,
    })
  }

  async findByZipCodeAndNumber(
    zipCode: string,
    number: string,
  ): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        zipCode,
        number,
      },
    })

    if (!address) {
      return null
    }

    return PrismaAddressMapper.toDomain(address)
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    })

    if (!address) {
      return null
    }

    return PrismaAddressMapper.toDomain(address)
  }
}
