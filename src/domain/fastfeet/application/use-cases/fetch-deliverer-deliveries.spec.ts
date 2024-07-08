import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchDelivererDeliveriesUseCase } from './fetch-deliverer-deliveries'
import { makeDelivery } from '@/test/factories/make-delivery'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: FetchDelivererDeliveriesUseCase

describe('Fetch deliverer deliveries use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    sut = new FetchDelivererDeliveriesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch deliverer deliveries', async () => {
    const deliverer = makeDeliverer()

    const deliveries = [
      makeDelivery({ delivererId: deliverer.id }),
      makeDelivery({ delivererId: deliverer.id }),
      makeDelivery({ delivererId: deliverer.id }),
      makeDelivery({ delivererId: deliverer.id }),
      makeDelivery({ delivererId: deliverer.id }),
    ]

    deliveries.forEach((delivery) => {
      inMemoryDeliveriesRepository.items.push(delivery)
    })

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.deliveries).toHaveLength(5)
    expect(result.value.deliveries).toEqual([
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
    ])
  })

  it('should be able to fetch paginated deliverer deliveries', async () => {
    const deliverer = makeDeliverer()

    for (let i = 0; i < 22; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({ delivererId: deliverer.id }),
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
