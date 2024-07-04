import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { AddressesRepository } from '../repositories/address-repository'
import { Address } from '../../enterprise/entities/address'

type AddressRequest = {
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  complement?: string
}

type RegisterRecipientUseCaseRequest = {
  name: string
  email: string
  address: AddressRequest
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

export class RegisterRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    email,
    name,
    address: recipientAddress,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const exisitingRecipient =
      await this.recipientsRepository.findByEmail(email)

    if (exisitingRecipient) {
      return left(new RecipientAlreadyExistsError(email))
    }

    let address = await this.addressesRepository.findByZipCodeAndNumber(
      recipientAddress.zipCode,
      recipientAddress.number,
    )

    if (!address) {
      const newAddress = Address.create(recipientAddress)

      address = newAddress

      await this.addressesRepository.create(newAddress)
    }

    const recipient = Recipient.create({
      addressId: address.id,
      email,
      name,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
