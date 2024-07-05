import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { PackageCreatedEvent } from '../../enterprise/events/package-created-event'
import { DispatchPackageUseCase } from '../use-cases/dispatch-package'

export class OnPackageCreated implements EventHandler {
  setupSubscriptions(): void {
    DomainEvents.register(
      this.dispatchCreatedPackage.bind(this),
      PackageCreatedEvent.name,
    )
  }

  constructor(private dispatchPackage: DispatchPackageUseCase) {
    this.setupSubscriptions()
  }

  private async dispatchCreatedPackage({
    packageCreated,
  }: PackageCreatedEvent) {
    await this.dispatchPackage.execute({
      packageId: packageCreated.id.toString(),
    })
  }
}
