import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Deliverer } from '@/domain/fastfeet/enterprise/entities/deliverer'
import { PrismaDelivererMapper } from '../mappers/prisma-deliverer-mapper'

@Injectable()
export class PrismaDeliverersRepository implements DeliverersRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliverer: Deliverer): Promise<void> {
    const data = PrismaDelivererMapper.toPrisma(deliverer)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliverer: Deliverer): Promise<void> {
    const data = PrismaDelivererMapper.toPrisma(deliverer)

    await this.prisma.user.update({
      where: {
        role: 'DELIVERER',
        id: deliverer.id.toString(),
      },
      data,
    })
  }

  async delete(deliverer: Deliverer): Promise<void> {
    await this.prisma.user.delete({
      where: {
        role: 'DELIVERER',
        id: deliverer.id.toString(),
      },
    })
  }

  async findByCpf(cpf: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        role: 'DELIVERER',
        cpf,
      },
    })

    if (!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }

  async findById(id: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        role: 'DELIVERER',
        id,
      },
    })

    if (!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        role: 'DELIVERER',
        email,
      },
    })

    if (!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }
}
