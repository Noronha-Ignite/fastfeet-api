import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { makePackage } from '@/test/factories/make-package'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { DeliveryStatus } from '../../enterprise/entities/value-objects/delivery-status'
import { makeDelivery } from '@/test/factories/make-delivery'
import { ReturnPackageUseCase } from './return-package'
import { NotAllowedDeliveryStatusError } from './errors/not-allowed-delivery-status-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let sut: ReturnPackageUseCase

describe('Return package use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    sut = new ReturnPackageUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to return a package', async () => {
    const packageCreated = makePackage()
    const delivery = makeDelivery({
      packageId: packageCreated.id,
      status: DeliveryStatus.create('DELIVERED'),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: delivery.id,
        status: DeliveryStatus.create('RETURNED'),
        packageId: packageCreated.id,
      }),
    )
  })

  it('should not be able to return a package that has not been delivered', async () => {
    const packageCreated = makePackage()
    const delivery = makeDelivery({
      packageId: packageCreated.id,
      status: DeliveryStatus.create('IN_TRANSIT'),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedDeliveryStatusError)
  })

  it('should not be able to return a package with no delivery associated', async () => {
    const packageCreated = makePackage()

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
