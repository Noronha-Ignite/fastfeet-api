/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/named
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { waitFor } from '@/test/utils/wait-for'
import { OnDeliveryStatusChanged } from './on-delivery-status-changed'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { makePackage } from '@/test/factories/make-package'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on delivery status changed', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnDeliveryStatusChanged(
      inMemoryPackagesRepository,
      sendNotificationUseCase,
    )
  })

  it.only('should send a notification when a delivery is created', async () => {
    const deliveryPackage = makePackage()
    const delivery = makeDelivery({
      packageId: deliveryPackage.id,
    })

    inMemoryPackagesRepository.create(deliveryPackage)
    inMemoryDeliveriesRepository.create(delivery)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })

  it('should send a notification when a delivery status is changed', async () => {
    const deliveryPackage = makePackage()
    const delivery = makeDelivery({
      packageId: deliveryPackage.id,
    })

    inMemoryPackagesRepository.create(deliveryPackage)
    inMemoryDeliveriesRepository.create(delivery)

    delivery.nextStatus()

    inMemoryDeliveriesRepository.save(delivery)

    await waitFor(() =>
      expect(sendNotificationExecuteSpy).toHaveBeenCalledTimes(2),
    )
  })
})
