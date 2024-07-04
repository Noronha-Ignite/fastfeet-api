import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { DispatchPackageUseCase } from './dispatch-package'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { makeRecipient } from '@/test/factories/make-recipient'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DispatchPackageUseCase

describe('Dispatch package use case', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DispatchPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryDeliveriesRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to dispatch a package', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      title: 'Package Recipient 1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPackagesRepository.items).toHaveLength(1)
    expect(inMemoryDeliveriesRepository.items).toHaveLength(1)
  })

  it('should not be able to dispatch a package without a valid recipient', async () => {
    const result = await sut.execute({
      recipientId: 'unexistent-recipient',
      title: 'Package Unexistent Recipient',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
