import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/fastfeet/enterprise/entities/admin'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from '../utils/generateRandomCpf'

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) => {
  const admin = Admin.create(
    {
      cpf: generateRandomCPF(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return admin
}
