import { Either, left, right } from '@/core/either'
import { Package } from '../../enterprise/entities/package'
import { Delivery } from '../../enterprise/entities/delivery'
import { PackagesRepository } from '../repositories/package-repository'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

type DispatchPackageUseCaseRequest = {
  title: string
  recipientId: string
}

type DispatchPackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    package: Package
    delivery: Delivery
  }
>

export class DispatchPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private deliveriesRepository: DeliveriesRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    title,
    recipientId,
  }: DispatchPackageUseCaseRequest): Promise<DispatchPackageUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const packageToBeDelivered = Package.create({
      title,
      recipientId: recipient.id,
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
