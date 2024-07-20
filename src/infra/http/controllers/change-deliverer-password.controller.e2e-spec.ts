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
import { AdminFactory } from '@/test/factories/make-admin'

describe('Change deliverer password (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let hasher: Hasher

  let adminFactory: AdminFactory
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [DelivererFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(Hasher)

    await app.init()
  })

  test('[PATCH] /deliverer/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })
    const deliverer = await delivererFactory.makePrismaDeliverer({
      password: await hasher.hash('unchanged-password'),
    })

    const response = await request(app.getHttpServer())
      .patch(`/deliverer/${deliverer.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'new password',
      })

    const delivererOnDatabase = await prisma.user.findFirst({
      where: {
        id: deliverer.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(delivererOnDatabase).toBeTruthy()
    expect(
      await hasher.compare('new password', delivererOnDatabase!.password),
    ).toBe(true)
  })
})
