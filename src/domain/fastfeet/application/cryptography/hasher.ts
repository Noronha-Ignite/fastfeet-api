export abstract class Hasher {
  abstract hash(raw: string): Promise<string>
  abstract compare(plain: string, hash: string): Promise<boolean>
}
