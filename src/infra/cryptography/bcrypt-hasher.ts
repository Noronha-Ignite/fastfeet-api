import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'
import { hash, compare } from 'bcryptjs'

export class BcryptHasher implements Hasher {
  private HASH_SALT_ROUNDS = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_ROUNDS)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
