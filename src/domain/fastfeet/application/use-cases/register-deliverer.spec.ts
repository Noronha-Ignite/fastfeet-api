import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RegisterDelivererUseCase } from './register-deliverer'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { InvalidCpfFormatError } from './errors/invalid-cpf-format-error'
import { InvalidEmailFormatError } from './errors/invalid-email-format-error '
import { makeDeliverer } from '@/test/factories/make-deliverer-factory'
import { generateRandomCPF } from '@/test/utils/generateRandomCpf'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let fakeHasher: FakeHasher
let sut: RegisterDelivererUseCase

describe('Register deliverer use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDelivererUseCase(inMemoryDeliverersRepository, fakeHasher)
  })

  it('should be able to register a new deliverer', async () => {
    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isRight()).toBe(true)

    const delivererOnDatabase =
      await inMemoryDeliverersRepository.findByCpf('12345678909')

    expect(delivererOnDatabase).not.toBeNull()
    expect(delivererOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        password: 'johndoe123456@deliverer-hashed',
        cpf: '12345678909',
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    )
  })

  it('should not create an deliverer that already exists with same cpf', async () => {
    const userCpf = generateRandomCPF()

    inMemoryDeliverersRepository.items.push(
      makeDeliverer({
        cpf: userCpf,
      }),
    )

    const result = await sut.execute({
      cpf: userCpf,
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DelivererAlreadyExistsError)
  })

  it('should not create an deliverer that already exists with same email', async () => {
    inMemoryDeliverersRepository.items.push(
      makeDeliverer({
        cpf: '12345678909',
        email: 'same-email@example.com',
      }),
    )

    const result = await sut.execute({
      cpf: '35211155009',
      email: 'same-email@example.com',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DelivererAlreadyExistsError)
  })

  it('should not create an deliverer with an invalid cpf format', async () => {
    const result = await sut.execute({
      cpf: 'invalid-cpf',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCpfFormatError)
  })

  it('should not create an deliverer with an invalid email format', async () => {
    const result = await sut.execute({
      cpf: '12345678909',
      email: 'invalid-email',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailFormatError)
  })
})
