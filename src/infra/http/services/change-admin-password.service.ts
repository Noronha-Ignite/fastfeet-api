import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { ChangeAdminPasswordUseCase } from '@/domain/fastfeet/application/use-cases/change-admin-password'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeAdminPasswordService extends ChangeAdminPasswordUseCase {
  constructor(adminsRepository: AdminsRepository, hasher: Hasher) {
    super(adminsRepository, hasher)
  }
}
