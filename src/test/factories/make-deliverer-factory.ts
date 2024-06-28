import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliverer,
  DelivererProps,
} from '@/domain/fastfeet/enterprise/entities/deliverer'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from '../utils/generateRandomCpf'

export const makeDeliverer = (
  override: Partial<DelivererProps> = {},
  id?: UniqueEntityID,
) => {
  const deliverer = Deliverer.create(
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

  return deliverer
}
