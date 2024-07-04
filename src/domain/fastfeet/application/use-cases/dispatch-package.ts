import { Either, right } from '@/core/either'
import { Package } from '../../enterprise/entities/package'
import { Delivery } from '../../enterprise/entities/delivery'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PackagesRepository } from '../repositories/package-repository'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

type DispatchPackageUseCaseRequest = {
  title: string
  recipientId: string
}

type DispatchPackageUseCaseResponse = Either<
  never,
  {
    package: Package
    delivery: Delivery
  }
>

export class DispatchPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    title,
    recipientId,
  }: DispatchPackageUseCaseRequest): Promise<DispatchPackageUseCaseResponse> {
    const packageToBeDelivered = Package.create({
      title,
      recipientId: new UniqueEntityID(recipientId),
    })

    const delivery = Delivery.create({
      packageId: packageToBeDelivered.id,
    })

    await Promise.all([
      this.packagesRepository.create(packageToBeDelivered),
      this.deliveriesRepository.create(delivery),
    ])

    return right({
      delivery,
      package: packageToBeDelivered,
    })
  }
}
