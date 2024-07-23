import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { DispatchPackageUseCase } from './dispatch-package'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { makePackage } from '@/test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { makeRecipient } from '@/test/factories/make-recipient'
import { makeAddress } from '@/test/factories/make-address'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: DispatchPackageUseCase

describe('Dispatch package use case', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
    )
    sut = new DispatchPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
      inMemoryAddressesRepository,
      inMemoryDeliveriesRepository,
    )
  })

  it('should be able to dispatch a package', async () => {
    const address = makeAddress()
    const recipient = makeRecipient({
      addressId: address.id,
    })
    const packageCreated = makePackage({
      recipientId: recipient.id,
    })

    inMemoryAddressesRepository.items.push(address)
    inMemoryRecipientsRepository.items.push(recipient)
    inMemoryPackagesRepository.items.push(packageCreated)

    const result = await sut.execute({
      packageId: packageCreated.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        destinationAddressId: address.id,
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
