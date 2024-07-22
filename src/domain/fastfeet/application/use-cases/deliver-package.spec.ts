import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { makePackage } from '@/test/factories/make-package'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { DeliverPackageUseCase } from './deliver-package'
import { makeDelivery } from '@/test/factories/make-delivery'
import { DeliveryStatus } from '../../enterprise/entities/value-objects/delivery-status'
import { NotAllowedDeliveryStatusError } from './errors/not-allowed-delivery-status-error'
import { PackageDeliveryDoesNotExistError } from './errors/package-delivery-does-not-exist-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { expect } from 'vitest'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: DeliverPackageUseCase

describe('Deliver package use case', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    sut = new DeliverPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to deliver a in transit package', async () => {
    const packageCreated = makePackage()
    const delivery = makeDelivery({
      packageId: packageCreated.id,
      status: DeliveryStatus.create('IN_TRANSIT'),
    })

    inMemoryPackagesRepository.items.push(packageCreated)
    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
      deliveredImageUrl: 'http://url/deliveredImageUrl.png',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPackagesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: packageCreated.id,
        deliveredImageUrl: 'http://url/deliveredImageUrl.png',
      }),
    )
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        packageId: packageCreated.id,
      }),
    )
  })

  it('should not be able to deliver a package without delivery associated', async () => {
    const packageCreated = makePackage()

    inMemoryPackagesRepository.items.push(packageCreated)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
      deliveredImageUrl: 'http://url/deliveredImageUrl.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PackageDeliveryDoesNotExistError)
  })

  it('should not be able to deliver a non-existing package', async () => {
    const result = await sut.execute({
      packageId: 'non-existing-package-id',
      deliveredImageUrl: 'http://url/deliveredImageUrl.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to deliver a package that is not in transit', async () => {
    const packageCreated = makePackage()
    const delivery = makeDelivery({
      packageId: packageCreated.id,
    })

    inMemoryPackagesRepository.items.push(packageCreated)
    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
      deliveredImageUrl: 'http://url/deliveredImageUrl.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedDeliveryStatusError)
  })
})
