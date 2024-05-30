import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateDTO {
  @IsUUID()
  uuid_exchange: string;

  @IsString()
  comment: string;

  @IsNumber()
  evaluation: number;

  @IsUUID()
  uuid_user: string;
}
