import { AuthenticateDelivererUseCase } from './authenticate-deliverer'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDeliverer } from '@/test/factories/make-deliverer-factory'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: AuthenticateDelivererUseCase

describe('Authenticate deliverer use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateDelivererUseCase(
      inMemoryDeliverersRepository,
      fakeEncrypter,
      fakeHasher,
    )
  })

  it('should be able to authenticate an deliverer', async () => {
    const createdDeliverer = makeDeliverer({
      cpf: '12345678909',
      password: 'johndoe123456@deliverer-hashed',
    })

    inMemoryDeliverersRepository.items.push(createdDeliverer)

    const result = await sut.execute({
      cpf: '12345678909',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate if deliverer does not exists', async () => {
    const result = await sut.execute({
      cpf: '93229361008',
      password: 'some-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate if password does not matches', async () => {
    const createdDeliverer = makeDeliverer({
      cpf: '12345678909',
      password: 'right-password-hashed',
    })

    inMemoryDeliverersRepository.items.push(createdDeliverer)

    const result = await sut.execute({
      cpf: '12345678909',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not create an deliverer with an invalid cpf format', async () => {
    const result = await sut.execute({
      cpf: 'invalid-cpf',
      password: 'some-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
