import { PackagesRepository } from '@/domain/fastfeet/application/repositories/package-repository'
import { Package } from '@/domain/fastfeet/enterprise/entities/package'

export class InMemoryPackagesRepository implements PackagesRepository {
  items: Package[] = []

  async create(recipientPackage: Package): Promise<void> {
    this.items.push(recipientPackage)
  }

  async findById(id: string): Promise<Package | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }
}
