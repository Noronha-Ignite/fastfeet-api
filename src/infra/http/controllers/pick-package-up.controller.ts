import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { PickPackageUpService } from '../services/pick-package-up.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliveryAlreadyPickedError } from '@/domain/fastfeet/application/use-cases/errors/delivery-already-picked-error'

@Controller('/packages/:packageId/pick-up')
export class PickPackageUpController {
  constructor(private pickPackageUpService: PickPackageUpService) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('packageId') packageId: string,
  ) {
    const { sub: delivererId } = user

    const result = await this.pickPackageUpService.execute({
      delivererId,
      packageId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case DeliveryAlreadyPickedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
