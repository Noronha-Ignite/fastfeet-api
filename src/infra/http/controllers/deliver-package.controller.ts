import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  HttpCode,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadImageService } from '../services/upload-image.service'
import { DeliverPackageService } from '../services/deliver-package.service'
import { InvalidImageTypeError } from '@/domain/fastfeet/application/use-cases/errors/invalid-image-type-error'
import { ResourceNotFoundError } from '@/core/errors/general/resource-not-found-error'
import { PackageDeliveryDoesNotExistError } from '@/domain/fastfeet/application/use-cases/errors/package-delivery-does-not-exist-error'
import { NotAllowedDeliveryStatusError } from '@/domain/fastfeet/application/use-cases/errors/not-allowed-delivery-status-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/packages/:packageId/deliver')
export class DeliverPackageController {
  constructor(
    private uploadImageService: UploadImageService,
    private deliverPackageService: DeliverPackageService,
  ) {}

  @Patch()
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('packageId') packageId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uploadResult = await this.uploadImageService.execute({
      body: file.buffer,
      filename: file.originalname,
      filetype: file.mimetype,
    })

    if (uploadResult.isLeft()) {
      const error = uploadResult.value

      switch (error.constructor) {
        case InvalidImageTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { sub: delivererId } = user

    const result = await this.deliverPackageService.execute({
      deliveredImageUrl: uploadResult.value.url,
      packageId,
      delivererId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case PackageDeliveryDoesNotExistError:
          throw new NotFoundException(error.message)
        case NotAllowedDeliveryStatusError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
