import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

export type FetchPackagesByCityUseCaseRequest = {
  city: string
}

export type FetchPackagesByCityUseCaseResponse = Either<
  never,
  {
    deliveries: Delivery[]
  }
>

export class FetchPackagesByCityUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    city,
  }: FetchPackagesByCityUseCaseRequest): Promise<FetchPackagesByCityUseCaseResponse> {
    const deliveries =
      await this.deliveriesRepository.findAllWaitingForPickupByCity(city)

    return right({
      deliveries,
    })
  }
}
