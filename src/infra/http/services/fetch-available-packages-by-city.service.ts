import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { FetchAvailablePackagesByCityUseCase } from '@/domain/fastfeet/application/use-cases/fetch-available-packages-by-city'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchAvailablePackagesByCityService extends FetchAvailablePackagesByCityUseCase {
  constructor(deliveriesRepository: DeliveriesRepository) {
    super(deliveriesRepository)
  }
}
