import { Either, left, right } from '@/core/either'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { Hasher } from '../cryptography/hasher'

type ChangeDelivererPasswordUseCaseRequest = {
  delivererId: string
  newPassword: string
}

type ChangeDelivererPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class ChangeDelivererPasswordUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    delivererId,
    newPassword,
  }: ChangeDelivererPasswordUseCaseRequest): Promise<ChangeDelivererPasswordUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if (!deliverer) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    deliverer.password = hashedPassword

    await this.deliverersRepository.save(deliverer)

    return right(null)
  }
}
