import { CreateDeliveryUseCase } from './create-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: CreateDeliveryUseCase

describe('Create delivery use case', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()
    sut = new CreateDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to create a delivery', async () => {
    const result = await sut.execute({
      fromAddressId: 'address-id-1',
      toAddressId: 'address-id-2',
      packageId: 'package-id',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
    )
  })
})
