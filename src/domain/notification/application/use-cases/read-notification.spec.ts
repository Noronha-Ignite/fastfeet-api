import { ReadNotificationUseCase } from './read-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/general/not-allowed-error'
import { makeNotification } from '@/test/factories/make-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    await inMemoryNotificationsRepository.create(
      makeNotification(
        {
          notificationRecipientId: new UniqueEntityID('recipient-1'),
        },
        new UniqueEntityID('notification-1'),
      ),
    )

    const result = await sut.execute({
      recipientId: 'recipient-1',
      notificationId: 'notification-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: expect.objectContaining({
        readAt: expect.any(Date),
      }),
    })
  })

  it('should not be able to read a notification from another user', async () => {
    const newNotification = makeNotification(
      {
        notificationRecipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('id-test'),
    )

    inMemoryNotificationsRepository.create(newNotification)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)

    const result = await sut.execute({
      notificationId: 'id-test',
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
