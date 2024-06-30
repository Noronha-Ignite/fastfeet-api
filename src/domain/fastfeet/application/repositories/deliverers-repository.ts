import { Deliverer } from '../../enterprise/entities/deliverer'

export abstract class DeliverersRepository {
  abstract create(deliverer: Deliverer): Promise<void>
  abstract save(deliverer: Deliverer): Promise<void>
  abstract delete(deliverer: Deliverer): Promise<void>

  abstract findByCpf(cpf: string): Promise<Deliverer | null>
  abstract findByEmail(email: string): Promise<Deliverer | null>
}
