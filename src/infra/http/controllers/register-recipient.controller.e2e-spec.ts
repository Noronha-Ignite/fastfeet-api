import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { CryptographyModule } from '../../cryptography/cryptography.module'
import { AdminFactory } from '@/test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Register Recipient (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /recipient', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/recipient')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@email.com',
        address: {
          uf: 'PE',
          city: 'Recife',
          street: 'Rua Recife Legal',
          number: '100',
          zipCode: '50000-000',
        },
      })

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: 'john.doe@email.com',
      },
      include: {
        address: true,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(recipientOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john.doe@email.com',
        address: expect.objectContaining({
          id: expect.any(String),
          street: 'Rua Recife Legal',
        }),
      }),
    )
  })
})
