import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { AddressFactory } from '@/test/factories/make-address'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { PackageFactory } from '@/test/factories/make-package'
import { RecipientFactory } from '@/test/factories/make-recipient'
import { waitFor } from '@/test/utils/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('On delivery status changed (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let addressFactory: AddressFactory
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory
  let deliveryFactory: DeliveryFactory
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryFactory,
        PackageFactory,
        RecipientFactory,
        AddressFactory,
        DelivererFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    addressFactory = moduleRef.get(AddressFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    delivererFactory = moduleRef.get(DelivererFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when a delivery status has changed', async () => {
    const address = await addressFactory.makePrismaAddress()
    const recipient = await recipientFactory.makePrismaRecipient({
      addressId: address.id,
    })
    const packageDelivered = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
    })
    await deliveryFactory.makePrismaDelivery({
      destinationAddressId: address.id,
      packageId: packageDelivered.id,
    })
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    await request(app.getHttpServer())
      .patch(`/packages/${packageDelivered.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          notificationRecipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
