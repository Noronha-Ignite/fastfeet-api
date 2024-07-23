import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { SendNotificationService } from './services/send-notification.service'

@Module({
  imports: [DatabaseModule],
  providers: [SendNotificationService],
})
export class EventsModule {}
