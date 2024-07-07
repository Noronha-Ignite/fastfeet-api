import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RegisterDelivererUseCase } from './register-deliverer'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { generateRandomCPF } from '@/test/utils/generateRandomCpf'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let fakeHasher: FakeHasher
let sut: RegisterDelivererUseCase

describe('Register deliverer use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDelivererUseCase(
      inMemoryDeliverersRepository,
      inMemoryAddressesRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliverer', async () => {
    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: 'johndoe123456@deliverer',
      address: {
        city: 'Shiny city',
        number: '7',
        street: 'Dream St.',
        uf: 'District 13',
        zipCode: '77777-777',
      },
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
      address: {
        city: 'Shiny city',
        number: '7',
        street: 'Dream St.',
        uf: 'District 13',
        zipCode: '77777-777',
      },
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
      address: {
        city: 'Shiny city',
        number: '7',
        street: 'Dream St.',
        uf: 'District 13',
        zipCode: '77777-777',
      },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DelivererAlreadyExistsError)
  })
})
