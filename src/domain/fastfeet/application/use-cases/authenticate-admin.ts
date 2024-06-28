import { Either, left, right } from '@/core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { Hasher } from '../cryptography/hasher'

type AuthenticateAdminUseCaseRequest = {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private encrypter: Encrypter,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const existingAdmin = await this.adminsRepository.findByCpf(cpf)

    if (!existingAdmin) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordsMatch = await this.hasher.compare(
      password,
      existingAdmin.password,
    )

    if (!doesPasswordsMatch) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: existingAdmin.id.toString(),
    })

    return right({ accessToken })
  }
}
