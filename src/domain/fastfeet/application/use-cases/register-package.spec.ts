import { RegisterPackageUseCase } from './register-package'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'
import { makeRecipient } from '@/test/factories/make-recipient'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: RegisterPackageUseCase

describe('Register package use case', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new RegisterPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to register a package', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      title: 'Package title',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPackagesRepository.items).toHaveLength(1)
    expect(inMemoryPackagesRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
      }),
    )
  })

  it('should not be able to register a package with no recipient', async () => {
    const result = await sut.execute({
      recipientId: 'non-existing-recipient-id',
      title: 'Package title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
