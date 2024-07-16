import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliverer,
  DelivererProps,
} from '@/domain/fastfeet/enterprise/entities/deliverer'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from '../utils/generateRandomCpf'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/http/database/prisma.service'
import { PrismaDelivererMapper } from '@/infra/http/database/mappers/prisma-deliverer-mapper'

export const makeDeliverer = (
  override: Partial<DelivererProps> = {},
  id?: UniqueEntityID,
) => {
  const deliverer = Deliverer.create(
    {
      cpf: generateRandomCPF(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return deliverer
}

@Injectable()
export class DelivererFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliverer(
    override: Partial<DelivererProps> = {},
  ): Promise<Deliverer> {
    const deliverer = makeDeliverer(override)

    await this.prisma.user.create({
      data: PrismaDelivererMapper.toPrisma(deliverer),
    })

    return deliverer
  }
}
