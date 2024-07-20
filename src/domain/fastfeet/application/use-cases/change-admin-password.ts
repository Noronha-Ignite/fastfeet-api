import { Either, left, right } from '@/core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { Hasher } from '../cryptography/hasher'

type ChangeAdminPasswordUseCaseRequest = {
  adminId: string
  newPassword: string
}

type ChangeAdminPasswordUseCaseResponse = Either<ResourceNotFoundError, null>

export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    adminId,
    newPassword,
  }: ChangeAdminPasswordUseCaseRequest): Promise<ChangeAdminPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    admin.password = hashedPassword

    await this.adminsRepository.save(admin)

    return right(null)
  }
}
