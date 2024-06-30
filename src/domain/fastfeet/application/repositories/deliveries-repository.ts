import { Delivery } from '../../enterprise/entities/delivery'

export abstract class DeliveriesRepository {
  abstract create(delivery: Delivery): Promise<void>
}
