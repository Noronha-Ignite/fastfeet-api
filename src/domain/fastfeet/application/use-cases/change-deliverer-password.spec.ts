import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { ChangeDelivererPasswordUseCase } from './change-deliverer-password'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { FakeHasher } from '@/test/cryptography/fake-hasher'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let fakeHasher: FakeHasher
let sut: ChangeDelivererPasswordUseCase

describe('Change deliverer password use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeDelivererPasswordUseCase(
      inMemoryDeliverersRepository,
      fakeHasher,
    )
  })

  it("should be able to change a deliverer's password", async () => {
    const deliverer = makeDeliverer({
      password: 'Unchanged password-hashed',
    })

    inMemoryDeliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      newPassword: 'Changed password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverersRepository.items[0]).toEqual(
      expect.objectContaining({
        password: 'Changed password-hashed',
      }),
    )
  })

  it("should not be able to change a non existent deliverer's password", async () => {
    const result = await sut.execute({
      delivererId: 'non-existing-id',
      newPassword: 'Changed password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
