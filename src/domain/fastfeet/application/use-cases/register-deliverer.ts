import { Either, left, right } from '@/core/either'
import { Deliverer } from '../../enterprise/entities/deliverer'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { Hasher } from '../cryptography/hasher'
import { InvalidCpfFormatError } from './errors/invalid-cpf-format-error'
import { validateCpf, validateEmail } from '@/utils/validation'
import { InvalidEmailFormatError } from './errors/invalid-email-format-error '

type RegisterDelivererUseCaseRequest = {
  name: string
  cpf: string
  email: string
  password: string
}

type RegisterDelivererUseCaseResponse = Either<
  DelivererAlreadyExistsError | InvalidCpfFormatError | InvalidEmailFormatError,
  {
    deliverer: Deliverer
  }
>

export class RegisterDelivererUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    email,
    name,
    password,
  }: RegisterDelivererUseCaseRequest): Promise<RegisterDelivererUseCaseResponse> {
    const isCpfValid = validateCpf(cpf)

    if (!isCpfValid) {
      return left(new InvalidCpfFormatError())
    }

    const isEmailValid = validateEmail(email)

    if (!isEmailValid) {
      return left(new InvalidEmailFormatError())
    }

    const delivererWithSameCpf = await this.deliverersRepository.findByCpf(cpf)

    if (delivererWithSameCpf) {
      return left(new DelivererAlreadyExistsError(cpf))
    }

    const delivererWithSameEmail =
      await this.deliverersRepository.findByEmail(email)

    if (delivererWithSameEmail) {
      return left(new DelivererAlreadyExistsError(email))
    }

    const hashedPassword = await this.hasher.hash(password)

    const deliverer = Deliverer.create({
      cpf,
      email,
      name,
      password: hashedPassword,
    })

    await this.deliverersRepository.create(deliverer)

    return right({ deliverer })
  }
}
