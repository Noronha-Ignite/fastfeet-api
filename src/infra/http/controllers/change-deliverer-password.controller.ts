import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '../guards/admin.guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ChangeDelivererPasswordService } from '../services/change-deliverer-password.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

const changeDelivererPasswordBodySchema = z.object({
  password: z.string(),
})

type ChangeDelivererPasswordBodySchema = z.infer<
  typeof changeDelivererPasswordBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  changeDelivererPasswordBodySchema,
)

@Controller('/deliverer/:delivererId/change-password')
export class ChangeDelivererPasswordController {
  constructor(
    private changeDelivererPasswordService: ChangeDelivererPasswordService,
  ) {}

  @Patch()
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeDelivererPasswordBodySchema,
    @Param('delivererId') delivererId: string,
  ) {
    const { password } = body

    const result = await this.changeDelivererPasswordService.execute({
      delivererId,
      newPassword: password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
