import { randomUUID } from 'crypto'

export class UniqueEntityID {
  private _value: string

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  toString() {
    return this._value
  }

  isEqualTo(id?: UniqueEntityID): boolean {
    return this._value === id?.toString()
  }

  toValue() {
    return this._value
  }
}
