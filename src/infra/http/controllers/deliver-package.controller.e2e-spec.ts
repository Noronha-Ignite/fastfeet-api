import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { PackageFactory } from '@/test/factories/make-package'
import { DeliveryStatus } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-status'
import { AddressFactory } from '@/test/factories/make-address'
import { RecipientFactory } from '@/test/factories/make-recipient'

describe('Deliver package (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let addressFactory: AddressFactory
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory
  let deliveryFactory: DeliveryFactory
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        DelivererFactory,
        PackageFactory,
        DeliveryFactory,
        RecipientFactory,
        AddressFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    addressFactory = moduleRef.get(AddressFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /package/:packageId/deliver', async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })
    const address = await addressFactory.makePrismaAddress()
    const recipient = await recipientFactory.makePrismaRecipient({
      addressId: address.id,
    })
    const packageDelivered = await packageFactory.makePrismaPackage({
      recipientId: recipient.id,
    })
    await deliveryFactory.makePrismaDelivery({
      packageId: packageDelivered.id,
      delivererId: deliverer.id,
      status: DeliveryStatus.create('IN_TRANSIT'),
      destinationAddressId: address.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/package/${packageDelivered.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './src/test/e2e/sample-upload.jpeg')

    const packageOnDatabase = await prisma.package.findUnique({
      where: {
        id: packageDelivered.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(packageOnDatabase).toEqual(
      expect.objectContaining({
        id: packageDelivered.id.toString(),
        deliveredImageUrl: expect.any(String),
      }),
    )
  })
})
