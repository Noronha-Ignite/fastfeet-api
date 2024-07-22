import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthenticateAdminService } from '../services/authenticate-admin.service'
import { z } from 'zod'
import { validateCPF } from '@/infra/utils/validations'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/fastfeet/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'

const authenticateAdminBodySchema = z.object({
  cpf: z.string().refine(validateCPF, {
    message: 'Invalid CPF format',
  }),
  password: z.string(),
})

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/admin/sessions')
export class AuthenticateAdminController {
  constructor(private authenticateAdminService: AuthenticateAdminService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  @Public()
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateAdminService.execute({
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
