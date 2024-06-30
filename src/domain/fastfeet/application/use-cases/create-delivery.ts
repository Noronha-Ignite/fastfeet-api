import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

type CreateDeliveryUseCaseRequest = {
  packageId: string
  fromAddressId: string
  toAddressId: string
}

type CreateDeliveryUseCaseResponse = Either<
  never,
  {
    delivery: Delivery
  }
>

export class CreateDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    fromAddressId,
    toAddressId,
    packageId,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
    const delivery = Delivery.create({
      toAddressId: new UniqueEntityID(toAddressId),
      fromAddressId: new UniqueEntityID(fromAddressId),
      packageId: new UniqueEntityID(packageId),
    })

    await this.deliveriesRepository.create(delivery)

    return right({ delivery })
  }
}
