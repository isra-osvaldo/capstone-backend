import { IsUUID } from 'class-validator';

export class UploadFileDTO {
  @IsUUID()
  uuid: string;

  @IsUUID()
  uuid_product: number;
}
