import { AppModule } from '@/infra/app.module'
import { AdminFactory } from '@/test/factories/make-admin'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication

  let adminFactory: AdminFactory
  let hasher: Hasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    hasher = moduleRef.get(Hasher)

    await app.init()
  })

  test('[POST] /admin/sessions', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: '12345678909',
      password: await hasher.hash('123456'),
    })

    const response = await request(app.getHttpServer())
      .post('/admin/sessions')
      .send({
        cpf: '12345678909',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
  })
})
