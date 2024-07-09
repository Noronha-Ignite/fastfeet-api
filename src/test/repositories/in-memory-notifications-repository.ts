import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    this.items = this.items.map((innerNotification) => {
      if (notification.id.isEqualTo(innerNotification.id)) {
        return notification
      }

      return innerNotification
    })
  }

  async findById(id: string): Promise<Notification | null> {
    return (
      this.items.find((notification) => notification.id.toString() === id) ??
      null
    )
  }
}
