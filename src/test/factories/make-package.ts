import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Package,
  PackageProps,
} from '@/domain/fastfeet/enterprise/entities/package'
import { faker } from '@faker-js/faker'

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
