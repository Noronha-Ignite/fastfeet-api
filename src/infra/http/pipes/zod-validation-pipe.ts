import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed.',
          statusCode: 400,
          errors: fromZodError(e),
        })
      }

      throw new BadRequestException('Validation failed')
    }

    return value
  }
}
