import { Injectable } from '@nestjs/common'
import { OnDeliveryStatusChanged } from '@/domain/notification/application/subscribers/on-delivery-status-changed'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Injectable()
export class OnDeliveryStatusChangedSubscription extends OnDeliveryStatusChanged {
  constructor(
    packagesRepository: PackagesRepository,
    sendNotification: SendNotificationUseCase,
  ) {
    super(packagesRepository, sendNotification)
  }
}
