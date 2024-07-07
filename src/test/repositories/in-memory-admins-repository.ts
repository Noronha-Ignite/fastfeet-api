import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { Admin } from '@/domain/fastfeet/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  items: Admin[] = []

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async save(admin: Admin): Promise<void> {
    this.items.map((item) => {
      if (item.id.isEqualTo(admin.id)) {
        return admin
      }

      return item
    })
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    return this.items.find((item) => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find((item) => item.email === email) ?? null
  }

  async findById(id: string): Promise<Admin | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }
}
