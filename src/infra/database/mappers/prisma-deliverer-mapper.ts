import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliverer } from '@/domain/fastfeet/enterprise/entities/deliverer'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaDelivererMapper {
  static toDomain(raw: PrismaUser): Deliverer {
    return Deliverer.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        cpf: raw.cpf,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliverer: Deliverer): Prisma.UserUncheckedCreateInput {
    return {
      id: deliverer.id.toString(),
      email: deliverer.email,
      name: deliverer.name,
      password: deliverer.password,
      cpf: deliverer.cpf,
      createdAt: deliverer.createdAt,
      updatedAt: deliverer.updatedAt,
      role: 'DELIVERER',
    }
  }
}
