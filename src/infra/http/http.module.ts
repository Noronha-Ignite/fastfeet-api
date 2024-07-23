import { Module } from '@nestjs/common'
import { AuthenticateDelivererService } from './services/authenticate-deliverer.service'
import { AuthenticateDelivererController } from './controllers/authenticate-deliverer.controller'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateAdminService } from './services/authenticate-admin.service'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller'
import { AdminGuard } from './guards/admin.guard'
import { ChangeAdminPasswordService } from './services/change-admin-password.service'
import { ChangeDelivererPasswordService } from './services/change-deliverer-password.service'
import { ChangeDelivererPasswordController } from './controllers/change-deliverer-password.controller'
import { RegisterDelivererController } from './controllers/register-deliverer.controller'
import { RegisterDelivererService } from './services/register-deliverer.service'
import { RegisterPackageController } from './controllers/register-package.controller'
import { RegisterPackageService } from './services/register-package.service'
import { RegisterRecipientController } from './controllers/register-recipient.controller'
import { RegisterRecipientService } from './services/register-recipient.service'
import { PickPackageUpController } from './controllers/pick-package-up.controller'
import { PickPackageUpService } from './services/pick-package-up.service'
import { DeliverPackageController } from './controllers/deliver-package.controller'
import { DeliverPackageService } from './services/deliver-package.service'
import { UploadImageService } from './services/upload-image.service'
import { EventsModule } from '../events/events.module'
import { StorageModule } from '../storage/storage.module'
import { ReturnPackageController } from './controllers/return-package.controller'
import { ReturnPackageService } from './services/return-package.service'
import { FetchDelivererDeliveriesService } from './services/fetch-deliverer-deliveries.service'
import { FetchDelivererDeliveriesController } from './controllers/fetch-deliverer-deliveries.controller'
import { FetchAvailablePackagesByCityController } from './controllers/fetch-available-packages-by-city.controller'
import { FetchAvailablePackagesByCityService } from './services/fetch-available-packages-by-city.service'

@Module({
  imports: [DatabaseModule, CryptographyModule, EventsModule, StorageModule],
  controllers: [
    AuthenticateDelivererController,
    AuthenticateAdminController,
    ChangeDelivererPasswordController,
    ChangeAdminPasswordController,
    DeliverPackageController,
    FetchAvailablePackagesByCityController,
    FetchDelivererDeliveriesController,
    PickPackageUpController,
    RegisterDelivererController,
    RegisterPackageController,
    RegisterRecipientController,
    ReturnPackageController,
  ],
  providers: [
    AuthenticateDelivererService,
    AuthenticateAdminService,
    ChangeDelivererPasswordService,
    ChangeAdminPasswordService,
    DeliverPackageService,
    FetchAvailablePackagesByCityService,
    FetchDelivererDeliveriesService,
    PickPackageUpService,
    RegisterDelivererService,
    RegisterPackageService,
    RegisterRecipientService,
    ReturnPackageService,
    UploadImageService,
    AdminGuard,
  ],
})
export class HttpModule {}
