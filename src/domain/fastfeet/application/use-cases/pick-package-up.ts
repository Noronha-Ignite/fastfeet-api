import { Either, left, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DeliveryAlreadyPickedError } from './errors/delivery-already-picked-error'

export type PickPackageUpUseCaseRequest = {
  packageId: string
  delivererId: string
}

export type PickPackageUpUseCaseResponse = Either<
  ResourceNotFoundError | DeliveryAlreadyPickedError,
  null
>

export class PickPackageUpUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliverersRepository: DeliverersRepository,
  ) {}

  async execute({
    packageId,
    delivererId,
  }: PickPackageUpUseCaseRequest): Promise<PickPackageUpUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findByPackageId(packageId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (
      delivery.delivererId !== null &&
      delivery.status.current !== 'WAITING_FOR_PICKUP'
    ) {
      return left(new DeliveryAlreadyPickedError())
    }

    const deliverer = await this.deliverersRepository.findById(delivererId)

    if (!deliverer) {
      return left(new ResourceNotFoundError())
    }

    delivery.delivererId = deliverer.id

    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
