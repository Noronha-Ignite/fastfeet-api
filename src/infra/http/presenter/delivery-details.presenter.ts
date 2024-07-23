import { DeliveryDetails } from '@/domain/fastfeet/enterprise/entities/value-objects/delivery-details'

export class DeliveryDetailsPresenter {
  static toHTTP(delivery: DeliveryDetails) {
    return {
      status: delivery.status.current,
      package: {
        title: delivery.package.title,
        slug: delivery.package.slug.value,
        recipient: {
          name: delivery.package.recipient.name,
          email: delivery.package.recipient.email,
        },
      },
      destination: delivery.destination,
    }
  }
}
