import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AdminGuard } from '../guards/admin.guard'
import { RegisterPackageService } from '../services/register-package.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'

const registerPackageBodySchema = z.object({
  recipientId: z.string(),
  title: z.string(),
})

type RegisterPackageBodySchema = z.infer<typeof registerPackageBodySchema>

@Controller('/package')
export class RegisterPackageController {
  constructor(private registerPackageService: RegisterPackageService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ZodValidationPipe(registerPackageBodySchema))
  async handle(@Body() body: RegisterPackageBodySchema) {
    const { recipientId, title } = body

    const result = await this.registerPackageService.execute({
      recipientId,
      title,
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
