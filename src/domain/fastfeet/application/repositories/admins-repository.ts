import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>

  abstract findById(id: string): Promise<Admin | null>
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
}
