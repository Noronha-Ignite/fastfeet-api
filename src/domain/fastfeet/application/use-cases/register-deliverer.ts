import { Either, left, right } from '@/core/either'
import { Deliverer } from '../../enterprise/entities/deliverer'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { Hasher } from '../cryptography/hasher'

type RegisterDelivererUseCaseRequest = {
  name: string
  cpf: string
  email: string
  password: string
}

type RegisterDelivererUseCaseResponse = Either<
  DelivererAlreadyExistsError,
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
