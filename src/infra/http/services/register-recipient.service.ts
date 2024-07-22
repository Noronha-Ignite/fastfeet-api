import { AddressesRepository } from '@/domain/fastfeet/application/repositories/address-repository'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { RegisterRecipientUseCase } from '@/domain/fastfeet/application/use-cases/register-recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterRecipientService extends RegisterRecipientUseCase {
  constructor(
    recipientsRepository: RecipientsRepository,
    addressesRepository: AddressesRepository,
  ) {
    super(recipientsRepository, addressesRepository)
  }
}
