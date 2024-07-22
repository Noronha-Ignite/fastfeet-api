import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { RegisterPackageUseCase } from '@/domain/fastfeet/application/use-cases/register-package'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterPackageService extends RegisterPackageUseCase {
  constructor(
    packagesRepository: PackagesRepository,
    recipientsRepository: RecipientsRepository,
  ) {
    super(packagesRepository, recipientsRepository)
  }
}
