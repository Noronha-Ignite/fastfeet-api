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
import { RegisterRecipientService } from '../services/register-recipient.service'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { validateZipcode } from '@/infra/utils/validations'

const registerRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.object({
    uf: z.string().length(2).toUpperCase(),
    city: z.string(),
    street: z.string(),
    number: z.string().regex(/^\d+$/, {
      message: 'String must contain only numbers',
    }),
    zipCode: z.string().refine(validateZipcode, {
      message: 'Invalid ZipCode format',
    }),
    complement: z.string().optional(),
  }),
})

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>

@Controller('/recipient')
export class RegisterRecipientController {
  constructor(private registerRecipientService: RegisterRecipientService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ZodValidationPipe(registerRecipientBodySchema))
  async handle(@Body() body: RegisterRecipientBodySchema) {
    const { name, email, address } = body

    const result = await this.registerRecipientService.execute({
      name,
      email,
      address,
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
