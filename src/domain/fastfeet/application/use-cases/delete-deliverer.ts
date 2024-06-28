import { Either, left, right } from '@/core/either'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'

type DeleteDelivererUseCaseRequest = {
  adminId: string
  cpf: string
}

type DeleteDelivererUseCaseResponse = Either<DelivererAlreadyExistsError, null>

export class DeleteDelivererUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    cpf,
    adminId,
  }: DeleteDelivererUseCaseRequest): Promise<DeleteDelivererUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const existingDeliverer = await this.deliverersRepository.findByCpf(cpf)

    if (!existingDeliverer) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverersRepository.delete(existingDeliverer)

    return right(null)
  }
}
