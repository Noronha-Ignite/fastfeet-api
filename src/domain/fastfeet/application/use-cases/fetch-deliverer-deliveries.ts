import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryDetails } from '../../enterprise/entities/value-objects/delivery-details'

export type FetchDelivererDeliveriesUseCaseRequest = {
  delivererId: string
  page: number
}

export type FetchDelivererDeliveriesUseCaseResponse = Either<
  never,
  {
    deliveries: DeliveryDetails[]
  }
>

export class FetchDelivererDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    delivererId,
    page = 1,
  }: FetchDelivererDeliveriesUseCaseRequest): Promise<FetchDelivererDeliveriesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.findManyByDelivererId(
      delivererId,
      {
        page,
      },
    )

    return right({
      deliveries,
    })
  }
}
