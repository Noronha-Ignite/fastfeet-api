import { Module } from '@nestjs/common'
import { AuthenticateDelivererService } from './services/authenticate-deliverer.service'
import { AuthenticateDelivererController } from './controllers/authenticate-deliverer.controller'
import { DatabaseModule } from './database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateDelivererController],
  providers: [AuthenticateDelivererService],
})
export class HttpModule {}
