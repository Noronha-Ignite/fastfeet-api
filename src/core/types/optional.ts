import { Prettify } from './prettify'

export type Optional<T, K extends keyof T> = Prettify<
  Omit<T, K> & Pick<Partial<T>, K>
>
