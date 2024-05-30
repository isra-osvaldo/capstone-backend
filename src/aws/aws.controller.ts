import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Put,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { IUser } from 'src/common/interface/user.interface';

@Controller()
export class AwsController {
  constructor(private readonly s3Service: S3Service) {}

  @Put('images/upload/:uuid_product')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @AuthenticatedUser() user: IUser,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('uuid_product') uuid_product: string,
  ) {
    return await this.s3Service.uploadImages(files, uuid_product, user);
  }

  @Put('image/upload/:uuid_publish')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(
    @AuthenticatedUser() user: IUser,
    @UploadedFile() file: Express.Multer.File,
    @Param('uuid_publish') uuid_publish: string,
  ) {
    return await this.s3Service.uploadImage(file, uuid_publish, user);
  }
}
