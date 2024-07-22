import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/fastfeet/enterprise/entities/package'
import { Slug } from '@/domain/fastfeet/enterprise/entities/value-objects/slug'
import { Package as PrismaPackage, Prisma } from '@prisma/client'

export class PrismaPackageMapper {
  static toDomain(raw: PrismaPackage): Package {
    return Package.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
        slug: Slug.create(raw.slug),
        deliveredImageUrl: raw.deliveredImageUrl,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(packageData: Package): Prisma.PackageUncheckedCreateInput {
    return {
      id: packageData.id.toString(),
      recipientId: packageData.recipientId.toString(),
      slug: packageData.slug.value,
      title: packageData.title,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt,
      deliveredImageUrl: packageData.deliveredImageUrl,
    }
  }
}
