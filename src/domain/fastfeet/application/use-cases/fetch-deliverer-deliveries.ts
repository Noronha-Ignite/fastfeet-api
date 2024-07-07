import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

export type FetchDelivererDeliveriesUseCaseRequest = {
  delivererId: string
  page: number
}

export type FetchDelivererDeliveriesUseCaseResponse = Either<
  never,
  {
    deliveries: Delivery[]
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
