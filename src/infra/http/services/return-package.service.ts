import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { ReturnPackageUseCase } from '@/domain/fastfeet/application/use-cases/return-package'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ReturnPackageService extends ReturnPackageUseCase {
  constructor(deliveriesRepository: DeliveriesRepository) {
    super(deliveriesRepository)
  }
}
