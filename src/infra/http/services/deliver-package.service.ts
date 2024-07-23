import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { DeliverPackageUseCase } from '@/domain/fastfeet/application/use-cases/deliver-package'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeliverPackageService extends DeliverPackageUseCase {
  constructor(
    packagesRepository: PackagesRepository,
    deliveriesRepository: DeliveriesRepository,
  ) {
    super(packagesRepository, deliveriesRepository)
  }
}
