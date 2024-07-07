import { InMemoryAdminsRepository } from '@/test/repositories/in-memory-admins-repository'
import { makeAdmin } from '@/test/factories/make-admin'
import { ChangeAdminPasswordUseCase } from './change-admin-password'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { FakeHasher } from '@/test/cryptography/fake-hasher'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: ChangeAdminPasswordUseCase

describe('Change admin password use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeAdminPasswordUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it("should be able to change a admin's password", async () => {
    const admin = makeAdmin({
      password: 'Unchanged password-hashed',
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: admin.cpf,
      newPassword: 'Changed password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0]).toEqual(
      expect.objectContaining({
        password: 'Changed password-hashed',
      }),
    )
  })

  it("should not be able to change a non existent admin's password", async () => {
    const result = await sut.execute({
      cpf: '12345678909', // Non-existent CPF
      newPassword: 'Changed password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
