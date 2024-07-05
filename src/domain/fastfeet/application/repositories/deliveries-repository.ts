import { Delivery } from '../../enterprise/entities/delivery'

export abstract class DeliveriesRepository {
  abstract create(delivery: Delivery): Promise<void>
  abstract save(delivery: Delivery): Promise<void>

  abstract findByPackageId(packageId: string): Promise<Delivery | null>
}
