import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { EnvModule } from './http/env/env.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './http/env/env'
import { AuthModule } from './http/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
