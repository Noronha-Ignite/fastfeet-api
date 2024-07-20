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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateDelivererController,
    AuthenticateAdminController,
    ChangeDelivererPasswordController,
    ChangeAdminPasswordController,
  ],
  providers: [
    AuthenticateDelivererService,
    AuthenticateAdminService,
    ChangeDelivererPasswordService,
    ChangeAdminPasswordService,
    AdminGuard,
  ],
})
export class HttpModule {}
