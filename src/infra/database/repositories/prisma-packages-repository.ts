import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { Package } from '@/domain/fastfeet/enterprise/entities/package'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaPackagesRepository implements PackagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipientPackage: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(recipientPackage)

    await this.prisma.package.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(recipientPackage.id)
  }

  async findById(id: string): Promise<Package | null> {
    const searchedPackage = await this.prisma.package.findUnique({
      where: {
        id,
      },
    })

    if (!searchedPackage) {
      return null
    }

    return PrismaPackageMapper.toDomain(searchedPackage)
  }
}
