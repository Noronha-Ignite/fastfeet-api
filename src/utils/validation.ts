function validateCpfFormat(cpf: string): boolean {
  // This regex matches exactly 11 digits
  const pattern = /^\d{11}$/
  return pattern.test(cpf)
}

function calculateCpfChecksum(cpf: string): boolean {
  // CPF should be exactly 11 digits
  if (cpf.length !== 11) {
    return false
  }

  // Calculate the first checksum digit
  let sum1 = 0
  for (let i = 0; i < 9; i++) {
    sum1 += parseInt(cpf[i]) * (10 - i)
  }
  let firstCheckDigit = 11 - (sum1 % 11)
  if (firstCheckDigit >= 10) {
    firstCheckDigit = 0
  }

  // Calculate the second checksum digit
  let sum2 = 0
  for (let i = 0; i < 10; i++) {
    sum2 += parseInt(cpf[i]) * (11 - i)
  }
  let secondCheckDigit = 11 - (sum2 % 11)
  if (secondCheckDigit >= 10) {
    secondCheckDigit = 0
  }

  // Verify the checksum digits
  return cpf.slice(-2) === `${firstCheckDigit}${secondCheckDigit}`
}

export function validateCpf(cpf: string): boolean {
  if (!validateCpfFormat(cpf)) {
    return false
  }

  return calculateCpfChecksum(cpf)
}

export function validateEmail(email: string): boolean {
  // This regex matches most valid email formats according to the general email format standard
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}
