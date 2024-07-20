import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/fastfeet/enterprise/entities/admin'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from '../utils/generateRandomCpf'
import { PrismaService } from '@/infra/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAdminMapper } from '@/infra/database/mappers/prisma-admin-mapper'

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) => {
  const admin = Admin.create(
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

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(override: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(override)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
