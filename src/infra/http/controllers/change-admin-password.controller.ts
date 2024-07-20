import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '../guards/admin.guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChangeAdminPasswordService } from '../services/change-admin-password.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

const changeAdminPasswordBodySchema = z.object({
  password: z.string(),
})

type ChangeAdminPasswordBodySchema = z.infer<
  typeof changeAdminPasswordBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(changeAdminPasswordBodySchema)

@Controller('/admin/change-password')
export class ChangeAdminPasswordController {
  constructor(private changeAdminPasswordService: ChangeAdminPasswordService) {}

  @Patch()
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeAdminPasswordBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user
    const { password } = body

    const result = await this.changeAdminPasswordService.execute({
      adminId: sub,
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
