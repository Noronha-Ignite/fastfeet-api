import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Deliverer } from '@/domain/fastfeet/enterprise/entities/deliverer'

export class InMemoryDeliverersRepository implements DeliverersRepository {
  items: Deliverer[] = []

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer)
  }

  async delete(deliverer: Deliverer): Promise<void> {
    this.items = this.items.filter((item) => !item.id.isEqualTo(deliverer.id))
  }

  async save(deliverer: Deliverer): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.id.isEqualTo(deliverer.id)) {
        return deliverer
      }

      return item
    })
  }

  async findByCpf(cpf: string): Promise<Deliverer | null> {
    return this.items.find((item) => item.cpf === cpf) ?? null
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    return this.items.find((item) => item.email === email) ?? null
  }
}
