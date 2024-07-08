import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../../enterprise/entities/delivery'

export abstract class DeliveriesRepository {
  abstract create(delivery: Delivery): Promise<void>
  abstract save(delivery: Delivery): Promise<void>

  abstract findByPackageId(packageId: string): Promise<Delivery | null>
  abstract findManyByDelivererId(
    delivererId: string,
    paginationParams: PaginationParams,
  ): Promise<Delivery[]>

  abstract findAllWaitingForPickupByCity(city: string): Promise<Delivery[]>
}
