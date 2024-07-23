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
import { AdminFactory } from '@/test/factories/make-admin'

describe('Deliver package (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let addressFactory: AddressFactory
  let adminFactory: AdminFactory
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
        AdminFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    addressFactory = moduleRef.get(AddressFactory)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /package/:packageId/return', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })
    const deliverer = await delivererFactory.makePrismaDeliverer()
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
      status: DeliveryStatus.create('DELIVERED'),
      destinationAddressId: address.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/packages/${packageDelivered.id.toString()}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const packageOnDatabase = await prisma.package.findUnique({
      where: {
        id: packageDelivered.id.toString(),
      },
      include: {
        delivery: true,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(packageOnDatabase).toEqual(
      expect.objectContaining({
        id: packageDelivered.id.toString(),
        delivery: expect.objectContaining({
          status: 'RETURNED',
        }),
      }),
    )
  })
})
