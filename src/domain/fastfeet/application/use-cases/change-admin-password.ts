import { Either, left, right } from '@/core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { Hasher } from '../cryptography/hasher'

type ChangeAdminPasswordUseCaseRequest = {
  cpf: string
  newPassword: string
}

type ChangeAdminPasswordUseCaseResponse = Either<AdminAlreadyExistsError, null>

export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    newPassword,
  }: ChangeAdminPasswordUseCaseRequest): Promise<ChangeAdminPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findByCpf(cpf)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    admin.password = hashedPassword

    await this.adminsRepository.save(admin)

    return right(null)
  }
}
