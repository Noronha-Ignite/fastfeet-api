import { Either, left, right } from '@/core/either'
import { Deliverer } from '../../enterprise/entities/deliverer'
import { DeliverersRepository } from '../repositories/deliverers-repository'
import { DelivererAlreadyExistsError } from './errors/deliverer-already-exists-error'
import { Hasher } from '../cryptography/hasher'
import { Address } from '../../enterprise/entities/address'
import { AddressesRepository } from '../repositories/address-repository'

type AddressRequest = {
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  complement?: string
}

type RegisterDelivererUseCaseRequest = {
  name: string
  cpf: string
  email: string
  password: string
  address: AddressRequest
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
    private addressesRepository: AddressesRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    email,
    name,
    password,
    address: delivererAddress,
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

    let address = await this.addressesRepository.findByZipCodeAndNumber(
      delivererAddress.zipCode,
      delivererAddress.number,
    )

    if (!address) {
      const newAddress = Address.create(delivererAddress)

      address = newAddress

      await this.addressesRepository.create(newAddress)
    }

    const hashedPassword = await this.hasher.hash(password)

    const deliverer = Deliverer.create({
      cpf,
      email,
      name,
      addressId: address.id,
      password: hashedPassword,
    })

    await this.deliverersRepository.create(deliverer)

    return right({ deliverer })
  }
}
