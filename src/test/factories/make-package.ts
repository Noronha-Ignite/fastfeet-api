import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Package,
  PackageProps,
} from '@/domain/fastfeet/enterprise/entities/package'
import { PrismaPackageMapper } from '@/infra/database/mappers/prisma-package-mapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makePackage = (
  override: Partial<PackageProps> = {},
  id?: UniqueEntityID,
) => {
  const packageCreated = Package.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.words(3),
      ...override,
    },
    id,
  )

  return packageCreated
}

@Injectable()
export class PackageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPackage(
    override: Partial<PackageProps> = {},
  ): Promise<Package> {
    const createdPackage = makePackage(override)

    await this.prisma.package.create({
      data: PrismaPackageMapper.toPrisma(createdPackage),
    })

    return createdPackage
  }
}
