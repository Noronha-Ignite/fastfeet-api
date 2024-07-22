type DeliveryStatuses =
  | 'WAITING_FOR_PICKUP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'

const DeliveryStatusLabel: Record<DeliveryStatuses, string> = {
  WAITING_FOR_PICKUP: 'Waiting for pick up',
  IN_TRANSIT: 'In transit',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
}

export class DeliveryStatus {
  private statuses: DeliveryStatuses[] = [
    'WAITING_FOR_PICKUP',
    'IN_TRANSIT',
    'DELIVERED',
    'RETURNED',
  ]

  private currentIndex: number = 0

  private constructor(status: DeliveryStatuses) {
    this.currentIndex = this.statuses.indexOf(status)

    if (this.currentIndex === -1) {
      throw new Error('Invalid initial status')
    }
  }

  static create(initialStatus: DeliveryStatuses = 'WAITING_FOR_PICKUP') {
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
