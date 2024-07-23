import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { AddressFactory } from '@/test/factories/make-address'
import { AdminFactory } from '@/test/factories/make-admin'
import { RecipientFactory } from '@/test/factories/make-recipient'
import { waitFor } from '@/test/utils/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('On package created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let addressFactory: AddressFactory
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AddressFactory, AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    addressFactory = moduleRef.get(AddressFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should create a delivery associated to the package created', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const address = await addressFactory.makePrismaAddress()
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'recipient name',
      addressId: address.id,
    })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    await request(app.getHttpServer())
      .post('/packages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        title: 'Package title', // Consequently slug will be "package-title-${randomString}"
      })

    await waitFor(async () => {
      const delivery = await prisma.delivery.findFirst({
        where: {
          package: {
            recipientId: recipient.id.toString(),
            title: 'Package title',
          },
        },
      })

      expect(delivery).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          packageId: expect.any(String),
          destinationAddressId: address.id.toString(),
        }),
      )
    })
  })
})
