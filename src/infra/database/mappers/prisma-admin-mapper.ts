import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/fastfeet/enterprise/entities/admin'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
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

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      email: admin.email,
      name: admin.name,
      password: admin.password,
      cpf: admin.cpf,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      role: 'ADMIN',
    }
  }
}
