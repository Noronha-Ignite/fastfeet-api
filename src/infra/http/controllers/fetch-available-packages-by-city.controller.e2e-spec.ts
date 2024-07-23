import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { JwtService } from '@nestjs/jwt'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { PackageFactory } from '@/test/factories/make-package'
import { RecipientFactory } from '@/test/factories/make-recipient'
import { AddressFactory } from '@/test/factories/make-address'
import { DeliveryFactory } from '@/test/factories/make-delivery'

describe('Fetch available packages by city (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let addressFactory: AddressFactory
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory
  let delivererFactory: DelivererFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        DelivererFactory,
        PackageFactory,
        RecipientFactory,
        AddressFactory,
        DeliveryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    addressFactory = moduleRef.get(AddressFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /packages/waiting-for-pick-up', async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    for (let i = 0; i < 3; i++) {
      const address = await addressFactory.makePrismaAddress({
        city: 'My city',
      })
      const recipient = await recipientFactory.makePrismaRecipient({
        addressId: address.id,
      })
      const packageToBePickedUp = await packageFactory.makePrismaPackage({
        recipientId: recipient.id,
      })
      await deliveryFactory.makePrismaDelivery({
        packageId: packageToBePickedUp.id,
        destinationAddressId: address.id,
        delivererId: deliverer.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/packages/waiting-for-pick-up`)
      .query({ city: 'My city' })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(3)
  })
})
