import { ValueObject } from '@/core/entities/value-object'
import { DeliveryStatus } from './delivery-status'
import { Slug } from './slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryDetailsProps {
  package: {
    title: string
    slug: Slug
    recipient: {
      name: string
      email: string
    }
  }
  destination: {
    uf: string
    city: string
    street: string
    number: string
    zipCode: string
    complement?: string | null
  }
  status: DeliveryStatus
  deliveryId: UniqueEntityID
}

export class DeliveryDetails extends ValueObject<DeliveryDetailsProps> {
  static create(props: DeliveryDetailsProps): DeliveryDetails {
    return new DeliveryDetails(props)
  }

  get package() {
    return this.props.package
  }

  get destination() {
    return this.props.destination
  }

  get status() {
    return this.props.status
  }

  get deliveryId() {
    return this.props.deliveryId
  }
}
