import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { PackagesRepository } from '../repositories/package-repository'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

type DispatchPackageUseCaseRequest = {
  packageId: string
}

type DispatchPackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

export class DispatchPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    packageId,
  }: DispatchPackageUseCaseRequest): Promise<DispatchPackageUseCaseResponse> {
    const existingPackage = await this.packagesRepository.findById(packageId)

    if (!existingPackage) {
      return left(new ResourceNotFoundError())
    }

    const delivery = Delivery.create({
      packageId: existingPackage.id,
    })

    await this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
