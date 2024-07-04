import { AuthenticateAdminUseCase } from './authenticate-admin'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from '@/test/repositories/in-memory-admins-repository'
import { makeAdmin } from '@/test/factories/make-admin'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: AuthenticateAdminUseCase

describe('Authenticate admin use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeEncrypter,
      fakeHasher,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const createdAdmin = makeAdmin({
      cpf: '12345678909',
      password: 'johndoe123456@admin-hashed',
    })

    inMemoryAdminsRepository.items.push(createdAdmin)

    const result = await sut.execute({
      cpf: '12345678909',
      password: 'johndoe123456@admin',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate if admin does not exists', async () => {
    const result = await sut.execute({
      cpf: '93229361008',
      password: 'some-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate if password does not matches', async () => {
    const createdAdmin = makeAdmin({
      cpf: '12345678909',
      password: 'right-password-hashed',
    })

    inMemoryAdminsRepository.items.push(createdAdmin)

    const result = await sut.execute({
      cpf: '12345678909',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
