import { Encrypter } from '@/domain/fastfeet/application/cryptography/encrypter'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { AuthenticateAdminUseCase } from '@/domain/fastfeet/application/use-cases/authenticate-admin'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticateAdminService extends AuthenticateAdminUseCase {
  constructor(
    adminsRepository: AdminsRepository,
    encrypter: Encrypter,
    hasher: Hasher,
  ) {
    super(adminsRepository, encrypter, hasher)
  }
}
