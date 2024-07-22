import { Either, left, right } from '@/core/either'
import { PackagesRepository } from '../repositories/packages-repository'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { PackageDeliveryDoesNotExistError } from './errors/package-delivery-does-not-exist-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { NotAllowedDeliveryStatusError } from './errors/not-allowed-delivery-status-error'

export type DeliverPackageUseCaseRequest = {
  packageId: string
  deliveredImageUrl: string
}

export type DeliverPackageUseCaseResponse = Either<
  | ResourceNotFoundError
  | PackageDeliveryDoesNotExistError
  | NotAllowedDeliveryStatusError,
  null
>

export class DeliverPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    packageId,
    deliveredImageUrl,
  }: DeliverPackageUseCaseRequest): Promise<DeliverPackageUseCaseResponse> {
    const packageToBeDelivered =
      await this.packagesRepository.findById(packageId)

    if (!packageToBeDelivered) {
      return left(new ResourceNotFoundError())
    }

    const delivery = await this.deliveriesRepository.findByPackageId(packageId)

    if (!delivery) {
      return left(new PackageDeliveryDoesNotExistError())
    }

    if (delivery.status.current !== 'IN_TRANSIT') {
      return left(new NotAllowedDeliveryStatusError(delivery.status))
    }

    packageToBeDelivered.deliveredImageUrl = deliveredImageUrl
    delivery.nextStatus()

    await this.packagesRepository.save(packageToBeDelivered)
    await this.deliveriesRepository.save(delivery)

    return right(null)
  }
}
