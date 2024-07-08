import { Address } from '../../enterprise/entities/address'

export abstract class AddressesRepository {
  abstract create(address: Address): Promise<void>

  abstract findByZipCodeAndNumber(
    zipCode: string,
    number: string,
  ): Promise<Address | null>

  abstract findById(id: string): Promise<Address | null>
}
