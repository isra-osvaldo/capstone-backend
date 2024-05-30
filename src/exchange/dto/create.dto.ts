import { IsString } from 'class-validator';

export class CreateExchangeDTO {
  @IsString()
  uuid_product_offer: string;

  @IsString()
  uuid_product_want: string;
}
