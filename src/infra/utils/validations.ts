export function validateCPF(cpf: string): boolean {
  // Check if the CPF length is exactly 11 digits and all characters are digits
  if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
    return false
  }

  // CPF cannot have all digits the same
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  // Calculate the first verification digit
  let sum1 = 0
  for (let i = 0; i < 9; i++) {
    sum1 += parseInt(cpf[i]) * (10 - i)
  }
  const digit1 = ((sum1 * 10) % 11) % 10

  // Calculate the second verification digit
  let sum2 = 0
  for (let i = 0; i < 10; i++) {
    sum2 += parseInt(cpf[i]) * (11 - i)
  }
  const digit2 = ((sum2 * 10) % 11) % 10

  // Check if the calculated digits match the input digits
  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10])
}

export function validateZipcode(zipcode: string): boolean {
  // Brazilian ZIP code pattern
  const pattern = /^\d{5}-\d{3}$/

  // Check if the ZIP code matches the pattern
  return pattern.test(zipcode)
}
