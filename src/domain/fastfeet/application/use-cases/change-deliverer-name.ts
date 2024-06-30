import { Either, left, right } from '@/core/either'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

type ChangeDelivererNameUseCaseRequest = {
  name: string
  cpf: string
}

type ChangeDelivererNameUseCaseResponse = Either<
  DelivererAlreadyExistsError,
  null
>

export class ChangeDelivererNameUseCase {
  constructor(private deliverersRepository: DeliverersRepository) {}

  async execute({
    cpf,
    name,
  }: ChangeDelivererNameUseCaseRequest): Promise<ChangeDelivererNameUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findByCpf(cpf)

    if (!deliverer) {
      return left(new ResourceNotFoundError())
    }

    deliverer.name = name

    await this.deliverersRepository.save(deliverer)

    return right(null)
  }
}
