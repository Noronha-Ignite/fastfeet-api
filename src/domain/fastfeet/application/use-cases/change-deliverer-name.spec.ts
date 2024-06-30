import { InMemoryDeliverersRepository } from '@/test/repositories/in-memory-deliverers-repository'
import { makeDeliverer } from '@/test/factories/make-deliverer-factory'
import { ChangeDelivererNameUseCase } from './change-deliverer-name'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

let inMemoryDeliverersRepository: InMemoryDeliverersRepository
let sut: ChangeDelivererNameUseCase

describe('Change deliverer name use case', () => {
  beforeEach(() => {
    inMemoryDeliverersRepository = new InMemoryDeliverersRepository()
    sut = new ChangeDelivererNameUseCase(inMemoryDeliverersRepository)
  })

  it("should be able to change a deliverer's name", async () => {
    const deliverer = makeDeliverer({
      name: 'Unchanged name',
    })

    inMemoryDeliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      cpf: deliverer.cpf,
      name: 'Changed name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Changed name',
      }),
    )
  })

  it("should not be able to change a non existent deliverer's name", async () => {
    const result = await sut.execute({
      cpf: '12345678909', // Non-existent CPF
      name: 'Changed name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
