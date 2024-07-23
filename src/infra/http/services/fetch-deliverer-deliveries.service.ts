import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { FetchDelivererDeliveriesUseCase } from '@/domain/fastfeet/application/use-cases/fetch-deliverer-deliveries'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchDelivererDeliveriesService extends FetchDelivererDeliveriesUseCase {
  constructor(deliveriesRepository: DeliveriesRepository) {
    super(deliveriesRepository)
  }
}
