import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '../guards/admin.guard'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { ReturnPackageService } from '../services/return-package.service'
import { NotAllowedDeliveryStatusError } from '@/domain/fastfeet/application/use-cases/errors/not-allowed-delivery-status-error'

@Controller('/packages/:packageId/return')
export class ReturnPackageController {
  constructor(private returnPackageService: ReturnPackageService) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(AdminGuard)
  async handle(@Param('packageId') packageId: string) {
    const result = await this.returnPackageService.execute({
      packageId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedDeliveryStatusError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
