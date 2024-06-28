export function generateRandomCPF(): string {
  const randomDigits = (): number => Math.floor(Math.random() * 9)
  const cpf = Array.from({ length: 9 }, randomDigits)

  const calculateDigit = (base: number[]): number => {
    const sum = base
      .map((digit, index) => digit * (base.length + 1 - index))
      .reduce((acc, curr) => acc + curr, 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const firstDigit = calculateDigit(cpf)
  cpf.push(firstDigit)

  const secondDigit = calculateDigit(cpf)
  cpf.push(secondDigit)

  return cpf.join('')
}
