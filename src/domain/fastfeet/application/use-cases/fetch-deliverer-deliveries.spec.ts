import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchDelivererDeliveriesUseCase } from './fetch-deliverer-deliveries'
import { makeDelivery } from '@/test/factories/make-delivery'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { makePackage } from '@/test/factories/make-package'
import { makeRecipient } from '@/test/factories/make-recipient'
import { makeAddress } from '@/test/factories/make-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchDelivererDeliveriesUseCase

describe('Fetch deliverer deliveries use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
    )
    sut = new FetchDelivererDeliveriesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch deliverer deliveries', async () => {
    const deliverer = makeDeliverer()
    const address = makeAddress()
    const recipient = makeRecipient({
      addressId: address.id,
    })

    inMemoryAddressesRepository.items.push(address)
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
        delivererId: deliverer.id,
        destinationAddressId: address.id,
        packageId: packages[0].id,
      }),
      makeDelivery({
        delivererId: deliverer.id,
        destinationAddressId: address.id,
        packageId: packages[1].id,
      }),
      makeDelivery({
        delivererId: deliverer.id,
        destinationAddressId: address.id,
        packageId: packages[2].id,
      }),
      makeDelivery({
        delivererId: deliverer.id,
        destinationAddressId: address.id,
        packageId: packages[3].id,
      }),
      makeDelivery({
        delivererId: deliverer.id,
        destinationAddressId: address.id,
        packageId: packages[4].id,
      }),
    ]

    for (let i = 0; i < 5; i++) {
      inMemoryPackagesRepository.items.push(packages[i])
      inMemoryDeliveriesRepository.items.push(deliveries[i])
    }

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.deliveries).toHaveLength(5)
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
      expect.objectContaining({
        deliveryId: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        deliveryId: expect.any(UniqueEntityID),
      }),
    ])
  })

  it('should be able to fetch paginated deliverer deliveries', async () => {
    const deliverer = makeDeliverer()

    for (let i = 0; i < 22; i++) {
      const address = makeAddress()
      const recipient = makeRecipient({
        addressId: address.id,
      })
      const packageDelivered = makePackage({
        recipientId: recipient.id,
      })

      inMemoryAddressesRepository.items.push(address)
      inMemoryRecipientsRepository.items.push(recipient)
      inMemoryPackagesRepository.items.push(packageDelivered)
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          delivererId: deliverer.id,
          destinationAddressId: address.id,
          packageId: packageDelivered.id,
        }),
      )
    }

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.deliveries).toHaveLength(2)
  })
})
