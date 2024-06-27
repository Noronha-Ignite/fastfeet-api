export abstract class Hasher {
  abstract hash(raw: string): Promise<string>
}
