import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RegisterAdminUseCase } from './register-admin'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from '@/test/repositories/in-memory-admins-repository'
import { makeAdmin } from '@/test/factories/make-admin'
import { generateRandomCPF } from '@/test/utils/generateRandomCpf'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Register admin use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to register a new admin', async () => {
    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@admin',
    })

    expect(result.isRight()).toBe(true)

    const adminOnDatabase =
      await inMemoryAdminsRepository.findByCpf('12345678909')

    expect(adminOnDatabase).not.toBeNull()
    expect(adminOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        password: 'johndoe123456@admin-hashed',
        cpf: '12345678909',
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    )
  })

  it('should not create an admin that already exists with same cpf', async () => {
    const userCpf = generateRandomCPF()

    inMemoryAdminsRepository.items.push(
      makeAdmin({
        cpf: userCpf,
      }),
    )

    const result = await sut.execute({
      cpf: userCpf,
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@admin',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })

  it('should not create an admin that already exists with same email', async () => {
    inMemoryAdminsRepository.items.push(
      makeAdmin({
        cpf: '12345678909',
        email: 'same-email@example.com',
      }),
    )

    const result = await sut.execute({
      cpf: '35211155009',
      email: 'same-email@example.com',
      name: 'John Doe',
      password: 'johndoe123456@admin',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })
})
