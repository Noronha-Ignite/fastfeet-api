import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { SendNotificationService } from './services/send-notification.service'
import { OnDeliveryStatusChangedSubscription } from './subscriptions/on-delivery-status-changed'
import { OnPackageCreatedSubscription } from './subscriptions/on-package-created.subscription'
import { DispatchPackageService } from './services/dispatch-package.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    SendNotificationService,
    DispatchPackageService,
    OnDeliveryStatusChangedSubscription,
    OnPackageCreatedSubscription,
  ],
})
export class EventsModule {}
