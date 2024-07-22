import { FakeUploader } from '@/test/storage/fake-uploader'
import { UploadImageUseCase } from './upload-image'
import { InvalidImageTypeError } from './errors/invalid-image-type-error'

let fakeUploader: FakeUploader
let sut: UploadImageUseCase

describe('Upload image use case', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader()
    sut = new UploadImageUseCase(fakeUploader)
  })

  it('should be able to upload a image', async () => {
    const result = await sut.execute({
      filename: 'test-image.jpeg',
      filetype: 'image/jpeg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        filename: 'test-image.jpeg',
        url: expect.any(String),
      }),
    )
  })

  it('should not be able to upload an invalid image type', async () => {
    const result = await sut.execute({
      filename: 'test-audio.mp3',
      filetype: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageTypeError)
  })
})
