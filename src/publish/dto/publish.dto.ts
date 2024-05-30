import { IsString, Length, IsUUID } from 'class-validator';
export class PublishDTO {
  @IsUUID()
  uuid_product: string;

  @IsString()
  @Length(3, 200)
  publish_description: string;
}
