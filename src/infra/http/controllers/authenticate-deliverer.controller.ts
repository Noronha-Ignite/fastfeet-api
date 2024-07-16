import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthenticateDelivererService } from '../services/authenticate-deliverer.service'
import { z } from 'zod'
import { validateCPF } from '@/infra/utils/validateCpf'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/fastfeet/application/use-cases/errors/invalid-credentials-error'
import { Public } from '../auth/public'

const authenticateDelivererBodySchema = z.object({
  cpf: z.string().refine(validateCPF, {
    message: 'Invalid CPF format',
  }),
  password: z.string(),
})

type AuthenticateDelivererBodySchema = z.infer<
  typeof authenticateDelivererBodySchema
>

@Controller('/deliverer/sessions')
export class AuthenticateDelivererController {
  constructor(
    private authenticateDelivererService: AuthenticateDelivererService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateDelivererBodySchema))
  @Public()
  async handle(@Body() body: AuthenticateDelivererBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateDelivererService.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { accessToken }
  }
}
