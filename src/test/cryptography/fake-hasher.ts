import { Hasher } from '@/domain/fastfeet/application/cryptography/hasher'

export class FakeHasher implements Hasher {
  async hash(raw: string): Promise<string> {
    return raw + '-hashed'
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain + '-hashed' === hash
  }
}
