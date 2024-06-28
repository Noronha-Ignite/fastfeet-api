import { Either, left, right } from '@/core/either'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { validateCpf } from '@/utils/validation'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { Hasher } from '../cryptography/hasher'

type AuthenticateDelivererUseCaseRequest = {
  cpf: string
  password: string
}

type AuthenticateDelivererUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateDelivererUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private encrypter: Encrypter,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDelivererUseCaseRequest): Promise<AuthenticateDelivererUseCaseResponse> {
    const isCpfValid = validateCpf(cpf)

    if (!isCpfValid) {
      return left(new InvalidCredentialsError())
    }

    const existingDeliverer = await this.deliverersRepository.findByCpf(cpf)

    if (!existingDeliverer) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordsMatch = await this.hasher.compare(
      password,
      existingDeliverer.password,
    )

    if (!doesPasswordsMatch) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: existingDeliverer.id.toString(),
    })

    return right({ accessToken })
  }
}
