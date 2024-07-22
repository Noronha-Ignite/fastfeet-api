import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PickPackageUpUseCase } from './pick-package-up'
import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDelivery } from '@/test/factories/make-delivery'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { DeliveryStatus } from '../../enterprise/entities/value-objects/delivery-status'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { DeliveryAlreadyPickedError } from './errors/delivery-already-picked-error'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let sut: PickPackageUpUseCase

describe('Pick package up use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    sut = new PickPackageUpUseCase(
      inMemoryDeliveriesRepository,
      inMemoryDeliverersRepository,
    )
  })

  it('should be able to pick a package up', async () => {
    const delivery = makeDelivery({
      packageId: new UniqueEntityID('package-id'),
    })
    const deliverer = makeDeliverer()

    inMemoryDeliveriesRepository.items.push(delivery)
    inMemoryDeliverersRepository.items.push(deliverer)

    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        status: DeliveryStatus.create(),
        delivererId: null,
      }),
    )

    const result = await sut.execute({
      packageId: 'package-id',
      delivererId: deliverer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        status: DeliveryStatus.create('IN_TRANSIT'),
        delivererId: deliverer.id,
      }),
    )
  })

  it('should not be able to pickup a package that has no delivery attributed to', async () => {
    const deliverer = makeDeliverer()

    inMemoryDeliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      packageId: 'non-existing-package-id',
      delivererId: deliverer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to pickup a package which has already been picked', async () => {
    const deliverer = makeDeliverer()
    const delivery = makeDelivery({
      packageId: new UniqueEntityID('package-id'),
      delivererId: deliverer.id,
      status: DeliveryStatus.create('IN_TRANSIT'),
    })

    inMemoryDeliveriesRepository.items.push(delivery)
    inMemoryDeliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      packageId: 'package-id',
      delivererId: deliverer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryAlreadyPickedError)
  })

  it('should not be able to pickup a package with a non existing deliverer', async () => {
    const delivery = makeDelivery({
      packageId: new UniqueEntityID('package-id'),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      packageId: 'package-id',
      delivererId: 'non-existing-deliverer-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
