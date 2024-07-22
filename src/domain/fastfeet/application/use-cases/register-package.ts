import { Either, left, right } from '@/core/either'
import { Package } from '../../enterprise/entities/package'
import { PackagesRepository } from '../repositories/packages-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

type RegisterPackageUseCaseRequest = {
  title: string
  recipientId: string
}

type RegisterPackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    package: Package
  }
>

export class RegisterPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    title,
    recipientId,
  }: RegisterPackageUseCaseRequest): Promise<RegisterPackageUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const packageToBeDelivered = Package.create({
      title,
      recipientId: recipient.id,
    })

    await this.packagesRepository.create(packageToBeDelivered)

    return right({
      package: packageToBeDelivered,
    })
  }
}
