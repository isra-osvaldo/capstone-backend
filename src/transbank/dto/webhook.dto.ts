import { IsString } from 'class-validator';

export class WebhookDTO {
  @IsString()
  token_ws: string;
}
