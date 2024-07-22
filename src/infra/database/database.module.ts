import { DeliverersRepository } from '@/domain/fastfeet/application/repositories/deliverers-repository'
import { Module } from '@nestjs/common'
import { PrismaDeliverersRepository } from './repositories/prisma-deliverers-repository'
import { PrismaService } from './prisma.service'
import { AdminsRepository } from '@/domain/fastfeet/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './repositories/prisma-admins-repository'
import { PackagesRepository } from '@/domain/fastfeet/application/repositories/packages-repository'
import { PrismaPackagesRepository } from './repositories/prisma-packages-repository'
import { RecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './repositories/prisma-recipients-repository'
import { AddressesRepository } from '@/domain/fastfeet/application/repositories/address-repository'
import { PrismaAddressesRepository } from './repositories/prisma-addresses-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    { provide: DeliverersRepository, useClass: PrismaDeliverersRepository },
    { provide: AddressesRepository, useClass: PrismaAddressesRepository },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: PackagesRepository, useClass: PrismaPackagesRepository },
    { provide: RecipientsRepository, useClass: PrismaRecipientsRepository },
  ],
  exports: [
    PrismaService,
    DeliverersRepository,
    AddressesRepository,
    AdminsRepository,
    PackagesRepository,
    RecipientsRepository,
  ],
})
export class DatabaseModule {}
