import { Uploader } from '@/domain/fastfeet/application/storage/uploader'
import { UploadImageUseCase } from '@/domain/fastfeet/application/use-cases/upload-image'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UploadImageService extends UploadImageUseCase {
  constructor(uploader: Uploader) {
    super(uploader)
  }
}
