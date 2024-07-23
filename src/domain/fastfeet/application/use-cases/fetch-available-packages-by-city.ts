import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryDetails } from '../../enterprise/entities/value-objects/delivery-details'

export type FetchAvailablePackagesByCityUseCaseRequest = {
  city: string
}

export type FetchAvailablePackagesByCityUseCaseResponse = Either<
  never,
  {
    deliveries: DeliveryDetails[]
  }
>

export class FetchAvailablePackagesByCityUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    city,
  }: FetchAvailablePackagesByCityUseCaseRequest): Promise<FetchAvailablePackagesByCityUseCaseResponse> {
    const deliveries =
      await this.deliveriesRepository.findAllWaitingForPickupByCity(city)

    return right({
      deliveries,
    })
  }
}
