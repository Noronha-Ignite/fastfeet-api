import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RegisterRecipientUseCase } from './register-recipient'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { makeAddress } from '@/test/factories/make-address'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let sut: RegisterRecipientUseCase

describe('Register recipient use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    sut = new RegisterRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAddressesRepository,
    )
  })

  it('should be able to register a new recipient', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      address: {
        city: 'Recife',
        number: '123',
        street: 'Rua Presidente Legal',
        uf: 'PE',
        zipCode: '50000-555',
      },
    })

    expect(result.isRight()).toBe(true)

    const addressOnDatabase =
      await inMemoryAddressesRepository.findByZipCodeAndNumber(
        '50000-555',
        '123',
      )
    const recipientOnDatabase = await inMemoryRecipientsRepository.findByEmail(
      'johndoe@example.com',
    )

    expect(recipientOnDatabase).not.toBeNull()
    expect(recipientOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        email: 'johndoe@example.com',
        name: 'John Doe',
        addressId: addressOnDatabase?.id,
      }),
    )
    expect(addressOnDatabase).not.toBeNull()
    expect(addressOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        zipCode: '50000-555',
      }),
    )
  })

  it('should not save the address if the address already exists while registing recipient', async () => {
    const address = makeAddress({
      zipCode: '50000-555',
      number: '123',
    })

    inMemoryAddressesRepository.items.push(address)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      address: {
        city: 'Recife',
        number: '123',
        street: 'Rua Presidente Legal',
        uf: 'PE',
        zipCode: '50000-555',
      },
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAddressesRepository.items).toHaveLength(1)
    expect(inMemoryAddressesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: address.id,
        zipCode: '50000-555',
      }),
    )
  })
})
