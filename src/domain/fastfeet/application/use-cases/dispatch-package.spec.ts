import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { DispatchPackageUseCase } from './dispatch-package'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { makePackage } from '@/test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: DispatchPackageUseCase

describe('Dispatch package use case', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()
    sut = new DispatchPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to dispatch a package', async () => {
    const packageCreated = makePackage()

    inMemoryPackagesRepository.items.push(packageCreated)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
    )
  })

  it('should not be able to dispatch a non-existing package', async () => {
    const result = await sut.execute({
      packageId: 'non-existing-package-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
