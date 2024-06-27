import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>

  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findByEmail(cpf: string): Promise<Admin | null>
}
