import { Injectable } from '@nestjs/common'
import { OnPackageCreated } from '@/domain/fastfeet/application/subscribers/on-package-created'
import { DispatchPackageService } from '../services/dispatch-package.service'

@Injectable()
export class OnPackageCreatedSubscription extends OnPackageCreated {
  constructor(dispatchPackageService: DispatchPackageService) {
    super(dispatchPackageService)
  }
}
