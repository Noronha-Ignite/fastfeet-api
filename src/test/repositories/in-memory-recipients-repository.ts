import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }
}
