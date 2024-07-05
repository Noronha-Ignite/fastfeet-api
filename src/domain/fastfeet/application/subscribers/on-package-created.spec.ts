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

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let dispatchPackageUseCase: DispatchPackageUseCase

let dispatchPackageExecuteSpy: MockInstance<
  [DispatchPackageUseCaseRequest],
  Promise<DispatchPackageUseCaseResponse>
>

describe('on package created', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()
    dispatchPackageUseCase = new DispatchPackageUseCase(
      inMemoryPackagesRepository,
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
