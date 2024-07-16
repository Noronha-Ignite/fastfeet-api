import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Module } from '@nestjs/common'
import { PrismaDeliverersRepository } from './repositories/prisma-deliverers-repository'
import { PrismaService } from './prisma.service'

@Module({
  imports: [],
  providers: [
    PrismaService,
    { provide: DeliverersRepository, useClass: PrismaDeliverersRepository },
  ],
  exports: [PrismaService, DeliverersRepository],
})
export class DatabaseModule {}
