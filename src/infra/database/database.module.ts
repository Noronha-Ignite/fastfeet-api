import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Module } from '@nestjs/common'
import { PrismaDeliverersRepository } from './repositories/prisma-deliverers-repository'
import { PrismaService } from './prisma.service'
import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './repositories/prisma-admins-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    { provide: DeliverersRepository, useClass: PrismaDeliverersRepository },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
  ],
  exports: [PrismaService, DeliverersRepository, AdminsRepository],
})
export class DatabaseModule {}
