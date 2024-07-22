import { DeliveryStatus } from './delivery-status'

describe('Delivery status value object', () => {
  it('should start with waiting for pickup status', () => {
    const deliveryStatus = DeliveryStatus.create()

    expect(deliveryStatus).toBeInstanceOf(DeliveryStatus)
    expect(deliveryStatus.current).toBe('WAITING_FOR_PICKUP')
  })

  it('should advance status when calling next status function', () => {
    const deliveryStatus = DeliveryStatus.create()

    deliveryStatus.next()

    expect(deliveryStatus).toBeInstanceOf(DeliveryStatus)
    expect(deliveryStatus.current).toBe('IN_TRANSIT')
  })
})
