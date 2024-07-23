import { Controller, Get, Query } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchDelivererDeliveriesService } from '../services/fetch-deliverer-deliveries.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryDetailsPresenter } from '../presenter/delivery-details.presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/me/packages')
export class FetchDelivererDeliveriesController {
  constructor(
    private fetchDelivererDeliveriesService: FetchDelivererDeliveriesService,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: delivererId } = user

    const result = await this.fetchDelivererDeliveriesService.execute({
      delivererId,
      page,
    })

    return {
      deliveries: result.value.deliveries.map(DeliveryDetailsPresenter.toHTTP),
    }
  }
}
