import {
  UploadParams,
  Uploader,
} from '@/domain/fastfeet/application/storage/uploader'
import { faker } from '@faker-js/faker'

interface Upload {
  filename: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ filename }: UploadParams): Promise<{ url: string }> {
    const url = faker.internet.url()

    this.uploads.push({
      filename,
      url,
    })

    return { url }
  }
}
