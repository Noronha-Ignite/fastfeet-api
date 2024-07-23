import {
  UploadParams,
  Uploader,
} from '@/domain/fastfeet/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: EnvService) {
    const accountId = env.get('CLOUDFLARE_ACCOUNT_ID')
    const accessKeyId = env.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = env.get('AWS_SECRET_ACCESS_KEY_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async upload({
    filename,
    filetype,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFilename = `${uploadId}-${filename}`

    const bucketName = this.env.get('AWS_BUCKET_NAME')

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFilename,
        ContentType: filetype,
        Body: body,
      }),
    )

    return {
      url: uniqueFilename,
    }
  }
}
