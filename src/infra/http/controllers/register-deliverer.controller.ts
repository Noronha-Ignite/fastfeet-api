import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { RegisterDelivererService } from '../services/register-deliverer.service'
import { z } from 'zod'
import { validateCPF } from '@/infra/utils/validations'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AdminGuard } from '../guards/admin.guard'
import { DelivererAlreadyExistsError } from '@/domain/fastfeet/application/use-cases/errors/deliverer-already-exists-error'

const registerDelivererBodySchema = z.object({
  cpf: z.string().refine(validateCPF, {
    message: 'Invalid CPF format',
  }),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type RegisterDelivererBodySchema = z.infer<typeof registerDelivererBodySchema>

@Controller('/deliverer')
export class RegisterDelivererController {
  constructor(private registerDelivererService: RegisterDelivererService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ZodValidationPipe(registerDelivererBodySchema))
  async handle(@Body() body: RegisterDelivererBodySchema) {
    const { cpf, password, email, name } = body

    const result = await this.registerDelivererService.execute({
      cpf,
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DelivererAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
