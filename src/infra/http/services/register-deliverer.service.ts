import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { RegisterDelivererUseCase } from '@/domain/fastfeet/application/use-cases/register-deliverer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterDelivererService extends RegisterDelivererUseCase {
  constructor(deliverersRepository: DeliverersRepository, hasher: Hasher) {
    super(deliverersRepository, hasher)
  }
}
