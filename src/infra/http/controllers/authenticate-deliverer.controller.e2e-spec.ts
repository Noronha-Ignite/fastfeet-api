import { AppModule } from '@/infra/app.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'

describe('Authenticate Account (E2E)', () => {
  let app: INestApplication

  let delivererFactory: DelivererFactory
  let hasher: Hasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [DelivererFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get(DelivererFactory)
    hasher = moduleRef.get(Hasher)

    await app.init()
  })

  test('[POST] /deliverer/sessions', async () => {
    await delivererFactory.makePrismaDeliverer({
      cpf: '12345678909',
      password: await hasher.hash('123456'),
    })

    const response = await request(app.getHttpServer())
      .post('/deliverer/sessions')
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
