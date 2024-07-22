import { Either, left, right } from '@/core/either'
import { Uploader } from '../storage/uploader'
import { InvalidImageTypeError } from './errors/invalid-image-type-error'

interface UploadImageUseCaseRequest {
  filename: string
  filetype: string
  body: Buffer
}

type UploadImageUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    url: string
  }
>

const validFileTypeRegex = /^(image\/(jpeg|png))$|^application\/pdf/

export class UploadImageUseCase {
  constructor(private uploader: Uploader) {}

  async execute({
    body,
    filename,
    filetype,
  }: UploadImageUseCaseRequest): Promise<UploadImageUseCaseResponse> {
    if (!validFileTypeRegex.test(filetype)) {
      return left(new InvalidImageTypeError(filetype))
    }

    const { url } = await this.uploader.upload({
      body,
      filename,
      filetype,
    })

    return right({
      url,
    })
  }
}
