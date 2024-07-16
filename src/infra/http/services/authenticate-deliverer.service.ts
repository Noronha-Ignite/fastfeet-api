import { Encrypter } from '@/domain/fastfeet/application/cryptography/encrypter'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { AuthenticateDelivererUseCase } from '@/domain/fastfeet/application/use-cases/authenticate-deliverer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticateDelivererService extends AuthenticateDelivererUseCase {
  constructor(
    deliverersRepository: DeliverersRepository,
    encrypter: Encrypter,
    hasher: Hasher,
  ) {
    super(deliverersRepository, encrypter, hasher)
  }
}
