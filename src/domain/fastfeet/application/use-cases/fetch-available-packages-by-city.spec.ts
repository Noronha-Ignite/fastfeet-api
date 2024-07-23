import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { FetchAvailablePackagesByCityUseCase } from './fetch-available-packages-by-city'
import { makeAddress } from '@/test/factories/make-address'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { makePackage } from '@/test/factories/make-package'
import { makeRecipient } from '@/test/factories/make-recipient'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchAvailablePackagesByCityUseCase

describe('Fetch available packages by city use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
    )
    sut = new FetchAvailablePackagesByCityUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch packages by city', async () => {
    const address1 = makeAddress({ city: 'City 1' })
    const address2 = makeAddress({ city: 'City 2' })

    inMemoryAddressesRepository.items.push(address1, address2)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const packages = [
      makePackage({ recipientId: recipient.id }),
      makePackage({ recipientId: recipient.id }),
      makePackage({ recipientId: recipient.id }),
      makePackage({ recipientId: recipient.id }),
      makePackage({ recipientId: recipient.id }),
    ]

    const deliveries = [
      makeDelivery({
        destinationAddressId: address1.id,
        packageId: packages[0].id,
      }),
      makeDelivery({
        destinationAddressId: address1.id,
        packageId: packages[1].id,
      }),
      makeDelivery({
        destinationAddressId: address2.id,
        packageId: packages[2].id,
      }),
      makeDelivery({
        destinationAddressId: address2.id,
        packageId: packages[3].id,
      }),
      makeDelivery({
        destinationAddressId: address1.id,
        packageId: packages[4].id,
      }),
    ]

    for (let i = 0; i < 5; i++) {
      inMemoryPackagesRepository.items.push(packages[i])
      inMemoryDeliveriesRepository.items.push(deliveries[i])
    }

    const result = await sut.execute({
      city: 'City 1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.deliveries).toHaveLength(3)
    expect(result.value.deliveries).toEqual([
      expect.objectContaining({
        deliveryId: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        deliveryId: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        deliveryId: expect.any(UniqueEntityID),
      }),
    ])
  })
})
