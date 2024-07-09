import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export const makeNotification = (
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) => {
  const notification = Notification.create(
    {
      title: faker.lorem.words(4),
      content: faker.lorem.paragraph(2),
      notificationRecipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return notification
}
