import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IUser } from 'src/common/interface/user.interface';
import { PublishRepository } from 'src/db/repository/publish.repository';
import { ProductRepository } from 'src/db/repository/product.repository';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  constructor(
    private readonly publishRepository: PublishRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Método para subir una imagen a S3
   * @param file Imagen a subir
   * @param body Body de la petición
   * @param user Usuario de Keycloak
   */
  async uploadImage(
    file: Express.Multer.File,
    uuid_publish: string,
    user: IUser,
  ) {
    this.logger.log(`Subiendo imagen a S3`);

    const { originalname } = file;

    const { Location } = await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      `imgs/${originalname}`,
      file.mimetype,
    );

    await this.publishRepository.uploadImage(
      {
        uuid_user: user.sub,
        uuid: uuid_publish,
      },
      Location as string,
    );

    this.logger.log(`Imagen subida a S3 con éxito ${Location}`);
    return;
  }

  async uploadImages(
    files: Express.Multer.File[],
    uuid_product: string,
    user: IUser,
  ) {
    this.logger.log(`Subiendo imágenes a S3`);

    const promises = files.map((file) => {
      this.logger.log(`Subiendo imagen a S3 ${file.originalname}`);
      return this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        `imgs/${file.originalname}`,
        file.mimetype,
      );
    });

    this.logger.log(`Esperando a que se suban las imágenes a S3`);
    const locations = await Promise.all(promises);

    await this.productRepository.uploadImages(
      {
        uuid_user: user.sub,
        uuid: uuid_product,
      },
      locations.map((location) => location.Location),
    );

    this.logger.log(`Imágenes subidas a S3 con éxito`);
    return;
  }

  /**
   * Método para subir un archivo a S3
   * @param file Archivo a subir
   * @param bucket Bucket de S3
   * @param name Nombre del archivo
   * @param mimetype Tipo de archivo
   * @returns Respuesta de S3
   */
  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'sa-east-1',
      },
    };

    let s3Response;

    try {
      s3Response = await this.s3.upload(params).promise();
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Error al subir la imagen');
    }

    return s3Response;
  }
}
