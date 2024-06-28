import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Deliverer } from '@/domain/fastfeet/enterprise/entities/deliverer'

export class InMemoryDeliverersRepository implements DeliverersRepository {
  items: Deliverer[] = []

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer)
  }

  async findByCpf(cpf: string): Promise<Deliverer | null> {
    return this.items.find((item) => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    return this.items.find((item) => item.email === email) ?? null
  }
}
