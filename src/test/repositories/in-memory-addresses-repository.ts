import { AddressesRepository } from '@/domain/fastfeet/application/repositories/address-repository'
import { Address } from '@/domain/fastfeet/enterprise/entities/address'

export class InMemoryAddressesRepository implements AddressesRepository {
  items: Address[] = []

  async create(address: Address): Promise<void> {
    this.items.push(address)
  }

  async findByZipCodeAndNumber(
    zipCode: string,
    number: string,
  ): Promise<Address | null> {
    return (
      this.items.find(
        (item) => item.zipCode === zipCode && item.number === number,
      ) ?? null
    )
  }
}
