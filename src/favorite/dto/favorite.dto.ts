import { IsUUID } from 'class-validator';

export class FavoriteDTO {
  @IsUUID()
  uuid_product: string;
}
