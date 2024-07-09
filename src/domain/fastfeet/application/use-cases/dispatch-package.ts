import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { PackagesRepository } from '../repositories/package-repository'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { AddressesRepository } from '../repositories/address-repository'
import { InvalidAddressError } from './errors/invalid-address-error'

export type DispatchPackageUseCaseRequest = {
  packageId: string
}

export type DispatchPackageUseCaseResponse = Either<
  ResourceNotFoundError | InvalidAddressError,
  {
    delivery: Delivery
  }
>

export class DispatchPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private recipientsRepository: RecipientsRepository,
    private addressesRepository: AddressesRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    packageId,
  }: DispatchPackageUseCaseRequest): Promise<DispatchPackageUseCaseResponse> {
    const existingPackage = await this.packagesRepository.findById(packageId)

    if (!existingPackage) {
      return left(new ResourceNotFoundError())
    }

    const recipient = await this.recipientsRepository.findById(
      existingPackage.recipientId.toString(),
    )

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const address = await this.addressesRepository.findById(
      recipient.addressId.toString(),
    )

    if (!address) {
      return left(new InvalidAddressError())
    }

    const delivery = Delivery.create({
      packageId: existingPackage.id,
      destinationAddressId: address.id,
    })

    await this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
