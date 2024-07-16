import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/fastfeet/application/cryptography/encrypter'
import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: Hasher, useClass: BcryptHasher },
  ],
  exports: [Hasher, Encrypter],
})
export class CryptographyModule {}
