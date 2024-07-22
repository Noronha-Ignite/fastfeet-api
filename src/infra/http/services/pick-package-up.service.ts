import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { PickPackageUpUseCase } from '@/domain/fastfeet/application/use-cases/pick-package-up'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PickPackageUpService extends PickPackageUpUseCase {
  constructor(
    deliveriesRepository: DeliveriesRepository,
    deliverersRepository: DeliverersRepository,
  ) {
    super(deliveriesRepository, deliverersRepository)
  }
}
