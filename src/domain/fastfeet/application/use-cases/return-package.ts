import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { NotAllowedDeliveryStatusError } from './errors/not-allowed-delivery-status-error'

type ReturnPackageUseCaseRequest = {
  packageId: string
}

type ReturnPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedDeliveryStatusError,
  null
>

export class ReturnPackageUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    packageId,
  }: ReturnPackageUseCaseRequest): Promise<ReturnPackageUseCaseResponse> {
    const delivery = await this.deliveriesRepository.findByPackageId(packageId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (delivery.status.current !== 'DELIVERED') {
      return left(new NotAllowedDeliveryStatusError(delivery.status))
    }

    delivery.nextStatus()

    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
