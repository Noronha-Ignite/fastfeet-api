import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { FetchPackagesByCityUseCase } from './fetch-packages-by-city'
import { makeAddress } from '@/test/factories/make-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchPackagesByCityUseCase

describe('Fetch packages by city use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    sut = new FetchPackagesByCityUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch packages by city', async () => {
    const address1 = makeAddress({ city: 'City 1' })
    const address2 = makeAddress({ city: 'City 2' })

    inMemoryAddressesRepository.items.push(address1, address2)

    const deliveries = [
      makeDelivery({ destinationAddressId: address1.id }),
      makeDelivery({ destinationAddressId: address1.id }),
      makeDelivery({ destinationAddressId: address2.id }),
      makeDelivery({ destinationAddressId: address2.id }),
      makeDelivery({ destinationAddressId: address1.id }),
    ]

    deliveries.forEach((delivery) => {
      inMemoryDeliveriesRepository.items.push(delivery)
    })

    const result = await sut.execute({
      city: 'City 1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.deliveries).toHaveLength(3)
    expect(result.value.deliveries).toEqual([
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        destinationAddressId: address1.id,
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        destinationAddressId: address1.id,
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        destinationAddressId: address1.id,
      }),
    ])
  })
})
