import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { PackageFactory } from '@/test/factories/make-package'
import { RecipientFactory } from '@/test/factories/make-recipient'
import { AddressFactory } from '@/test/factories/make-address'
import { DeliveryFactory } from '@/test/factories/make-delivery'

describe('Pick package up (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let hasher: Hasher

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
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(Hasher)

    await app.init()
  })

  test('[PATCH] /packages/:packageId/pick-up', async () => {
    const address = await addressFactory.makePrismaAddress()
    const recipient = await recipientFactory.makePrismaRecipient({
      addressId: address.id,
    })
    const packageToBePickedUp = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
    })
    await deliveryFactory.makePrismaDelivery({
      packageId: packageToBePickedUp.id,
      destinationAddressId: address.id,
    })
    const deliverer = await delivererFactory.makePrismaDeliverer({
      password: await hasher.hash('unchanged-password'),
    })
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/packages/${packageToBePickedUp.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        packageId: packageToBePickedUp.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(deliveryOnDatabase).toEqual(
      expect.objectContaining({
        packageId: packageToBePickedUp.id.toString(),
        delivererId: deliverer.id.toString(),
      }),
    )
  })
})
