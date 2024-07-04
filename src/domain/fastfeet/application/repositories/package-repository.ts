import { Package } from '../../enterprise/entities/package'

export abstract class PackagesRepository {
  abstract create(recipientPackage: Package): Promise<void>
}
