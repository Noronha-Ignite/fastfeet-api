import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { Admin } from '@/domain/fastfeet/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  items: Admin[] = []

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    return this.items.find((item) => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find((item) => item.email === email) ?? null
  }
}
