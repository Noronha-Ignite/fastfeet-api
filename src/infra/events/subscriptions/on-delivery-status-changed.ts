import { Injectable } from '@nestjs/common'
import { OnDeliveryStatusChanged } from '@/domain/notification/application/subscribers/on-delivery-status-changed'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { SendNotificationService } from '../services/send-notification.service'

@Injectable()
export class OnDeliveryStatusChangedSubscription extends OnDeliveryStatusChanged {
  constructor(
    packagesRepository: PackagesRepository,
    sendNotification: SendNotificationService,
  ) {
    super(packagesRepository, sendNotification)
  }
}
