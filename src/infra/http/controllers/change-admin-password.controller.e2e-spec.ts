import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'
import { AdminFactory } from '@/test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'

describe('Authenticate Deliverer (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let hasher: Hasher

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
    hasher = moduleRef.get(Hasher)

    await app.init()
  })

  test('[PATCH] /admin/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hasher.hash('unchanged-password'),
    })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/admin/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'new password',
      })

    const adminOnDatabase = await prisma.user.findFirst({
      where: {
        id: admin.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(adminOnDatabase).toBeTruthy()
    expect(
      await hasher.compare('new password', adminOnDatabase!.password),
    ).toBe(true)
  })
})
