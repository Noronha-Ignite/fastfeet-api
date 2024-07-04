export enum DeliveryStatuses {
  WaitingForPickUp = 'WaitingForPickUp',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Returned = 'Returned',
}

const DeliveryStatusLabel: Record<DeliveryStatuses, string> = {
  [DeliveryStatuses.WaitingForPickUp]: 'Waiting for pick up',
  [DeliveryStatuses.InTransit]: 'In transit',
  [DeliveryStatuses.Delivered]: 'Delivered',
  [DeliveryStatuses.Returned]: 'Returned',
}

export class DeliveryStatus {
  private statuses = [
    DeliveryStatuses.WaitingForPickUp,
    DeliveryStatuses.InTransit,
    DeliveryStatuses.Delivered,
    DeliveryStatuses.Returned,
  ]

  private currentIndex: number = 0

  private constructor(status: DeliveryStatuses) {
    this.currentIndex = this.statuses.indexOf(status)

    if (this.currentIndex === -1) {
      throw new Error('Invalid initial status')
    }
  }

  static create(
    initialStatus: DeliveryStatuses = DeliveryStatuses.WaitingForPickUp,
  ) {
    return new DeliveryStatus(initialStatus)
  }

  get current(): DeliveryStatuses {
    return this.statuses[this.currentIndex]
  }

  next(): DeliveryStatuses {
    if (this.currentIndex < this.statuses.length - 1) {
      this.currentIndex++
    } else {
      throw new Error('Already at the final status')
    }

    return this.current
  }

  get label() {
    return DeliveryStatusLabel[this.current]
  }
}
