import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminsRepository: AdminsRepository) {}

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest()

    const { sub: userId } = request.user

    const admin = await this.adminsRepository.findById(userId)

    return !!admin
  }
}
