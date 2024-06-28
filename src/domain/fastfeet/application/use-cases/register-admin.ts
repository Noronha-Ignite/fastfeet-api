import { Either, left, right } from '@/core/either'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'
import { Hasher } from '../cryptography/hasher'
import { InvalidCpfFormatError } from './errors/invalid-cpf-format-error'
import { validateCpf, validateEmail } from '@/utils/validation'
import { InvalidEmailFormatError } from './errors/invalid-email-format-error '

type RegisterAdminUseCaseRequest = {
  name: string
  cpf: string
  email: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError | InvalidCpfFormatError | InvalidEmailFormatError,
  {
    admin: Admin
  }
>

export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    cpf,
    email,
    name,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const isCpfValid = validateCpf(cpf)

    if (!isCpfValid) {
      return left(new InvalidCpfFormatError())
    }

    const isEmailValid = validateEmail(email)

    if (!isEmailValid) {
      return left(new InvalidEmailFormatError())
    }

    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExistsError(cpf))
    }

    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

    if (adminWithSameEmail) {
      return left(new AdminAlreadyExistsError(email))
    }

    const hashedPassword = await this.hasher.hash(password)

    const admin = Admin.create({
      cpf,
      email,
      name,
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}
