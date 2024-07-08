/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/named
import { MockInstance, SpyInstance } from 'vitest'
import {
  DispatchPackageUseCase,
  DispatchPackageUseCaseRequest,
  DispatchPackageUseCaseResponse,
} from '../use-cases/dispatch-package'
import { makePackage } from '@/test/factories/make-package'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { InMemoryPackagesRepository } from '@/test/repositories/in-memory-packages-repository'
import { OnPackageCreated } from './on-package-created'
import { waitFor } from '@/test/utils/wait-for'
import { InMemoryAddressesRepository } from '@/test/repositories/in-memory-addresses-repository'
import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients-repository'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let dispatchPackageUseCase: DispatchPackageUseCase

let dispatchPackageExecuteSpy: MockInstance<
  [DispatchPackageUseCaseRequest],
  Promise<DispatchPackageUseCaseResponse>
>

describe('on package created', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryAddressesRepository,
    )
    dispatchPackageUseCase = new DispatchPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryRecipientsRepository,
      inMemoryAddressesRepository,
      inMemoryDeliveriesRepository,
    )

    dispatchPackageExecuteSpy = vi.spyOn(dispatchPackageUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnPackageCreated(dispatchPackageUseCase)
  })

  it('should dispatch the package when the same is created', async () => {
    const packageCreated = makePackage()

    await inMemoryPackagesRepository.create(packageCreated)

    await waitFor(() => expect(dispatchPackageExecuteSpy).toHaveBeenCalled())
  })
})
