import { DeleteDelivererUseCase } from './delete-deliverer'
import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDeliverer } from '@/test/factories/make-deliverer-factory'
import { InMemoryAdminsRepository } from '@/test/repositories/in-memory-admins-repository'
import { makeAdmin } from '@/test/factories/make-admin-factory'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteDelivererUseCase

describe('Delete deliverer use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteDelivererUseCase(
      inMemoryDeliverersRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to delete a deliverer', async () => {
    const createdAdmin = makeAdmin()
    const createdDeliverer = makeDeliverer({
      cpf: '12345678909',
      password: 'johndoe123456@deliverer-hashed',
    })

    inMemoryDeliverersRepository.items.push(createdDeliverer)
    inMemoryAdminsRepository.items.push(createdAdmin)

    const result = await sut.execute({
      cpf: '12345678909',
      adminId: createdAdmin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a deliverer if valid adminId is not provided', async () => {
    const createdDeliverer = makeDeliverer({
      cpf: '12345678909',
      password: 'johndoe123456@deliverer-hashed',
    })

    inMemoryDeliverersRepository.items.push(createdDeliverer)

    const result = await sut.execute({
      cpf: '12345678909',
      adminId: 'invalid-admin-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryDeliverersRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a deliverer if deliverer not exists', async () => {
    const createdAdmin = makeAdmin()

    inMemoryAdminsRepository.items.push(createdAdmin)

    const result = await sut.execute({
      cpf: '12345678909',
      adminId: createdAdmin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
