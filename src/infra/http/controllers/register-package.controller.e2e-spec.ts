import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { CryptographyModule } from '../../cryptography/cryptography.module'
import { AdminFactory } from '@/test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { RecipientFactory } from '@/test/factories/make-recipient'
import { AddressFactory } from '@/test/factories/make-address'

describe('Register Package (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let adminFactory: AdminFactory
  let addressFactory: AddressFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdminFactory, RecipientFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    addressFactory = moduleRef.get(AddressFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /package', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const address = await addressFactory.makePrismaAddress()
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'recipient name',
      addressId: address.id,
    })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/package')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        title: 'Package title', // Consequently slug will be "package-title"
      })

    const packageOnDatabase = await prisma.package.findFirst({
      where: {
        title: 'Package title',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(packageOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Package title',
        recipientId: recipient.id.toString(),
      }),
    )
  })
})
