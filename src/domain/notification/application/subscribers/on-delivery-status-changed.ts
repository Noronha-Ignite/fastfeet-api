import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { DeliveryStatusChangedEvent } from '@/domain/fastfeet/enterprise/events/delivery-status-changed-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'

export class OnDeliveryStatusChanged implements EventHandler {
  setupSubscriptions(): void {
    DomainEvents.register(
      this.notifyDeliveryStatusChange.bind(this),
      DeliveryStatusChangedEvent.name,
    )
  }

  constructor(
    private packagesRepository: PackagesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  private async notifyDeliveryStatusChange({
    delivery,
  }: DeliveryStatusChangedEvent) {
    const packageBeindDelivered = await this.packagesRepository.findById(
      delivery.packageId.toString(),
    )

    if (packageBeindDelivered) {
      await this.sendNotification.execute({
        recipientId: packageBeindDelivered.recipientId.toString(),
        title: 'You got a delivery status update',
        content: `Your delivery status from package '${packageBeindDelivered.title}' has changed, check it out!`,
      })
    }
  }
}
