import { Package } from '../../enterprise/entities/package'

export abstract class PackagesRepository {
  abstract create(recipientPackage: Package): Promise<void>
  abstract save(recipientPackage: Package): Promise<void>

  abstract findById(id: string): Promise<Package | null>
}
