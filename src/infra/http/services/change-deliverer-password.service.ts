import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { ChangeDelivererPasswordUseCase } from '@/domain/fastfeet/application/use-cases/change-deliverer-password'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeDelivererPasswordService extends ChangeDelivererPasswordUseCase {
  constructor(deliverersRepository: DeliverersRepository, hasher: Hasher) {
    super(deliverersRepository, hasher)
  }
}
