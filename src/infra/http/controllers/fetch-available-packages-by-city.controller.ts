import { Controller, Get, Query } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryDetailsPresenter } from '../presenter/delivery-details.presenter'
import { FetchAvailablePackagesByCityService } from '../services/fetch-available-packages-by-city.service'

const cityQueryParamSchema = z.string()

const queryValidationPipe = new ZodValidationPipe(cityQueryParamSchema)

type CityQueryParamSchema = z.infer<typeof cityQueryParamSchema>

@Controller('/packages/waiting-for-pick-up')
export class FetchAvailablePackagesByCityController {
  constructor(
    private fetchAvailablePackagesByCityService: FetchAvailablePackagesByCityService,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('city', queryValidationPipe) city: CityQueryParamSchema,
  ) {
    const result = await this.fetchAvailablePackagesByCityService.execute({
      city,
    })

    return {
      deliveries: result.value.deliveries.map(DeliveryDetailsPresenter.toHTTP),
    }
  }
}
