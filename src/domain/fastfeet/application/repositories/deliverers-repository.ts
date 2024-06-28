import { Deliverer } from '../../enterprise/entities/deliverer'

export abstract class DeliverersRepository {
  abstract create(deliverer: Deliverer): Promise<void>

  abstract findByCpf(cpf: string): Promise<Deliverer | null>
  abstract findByEmail(cpf: string): Promise<Deliverer | null>
}
