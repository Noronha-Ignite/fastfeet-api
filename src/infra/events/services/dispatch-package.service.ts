import { AddressesRepository } from '@/domain/fastfeet/application/repositories/address-repository'
import { DeliveriesRepository } from '@/domain/fastfeet/application/repositories/deliveries-repository'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { DispatchPackageUseCase } from '@/domain/fastfeet/application/use-cases/dispatch-package'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DispatchPackageService extends DispatchPackageUseCase {
  constructor(
    packagesRepository: PackagesRepository,
    recipientsRepository: RecipientsRepository,
    addressesRepository: AddressesRepository,
    deliveriesRepository: DeliveriesRepository,
  ) {
    super(
      packagesRepository,
      recipientsRepository,
      addressesRepository,
      deliveriesRepository,
    )
  }
}
