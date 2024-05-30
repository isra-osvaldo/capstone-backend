import { IsIn } from 'class-validator';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';

export class PatchStatusDTO {
  @IsIn([
    ExchangeStatusEnum.ACCEPTED,
    ExchangeStatusEnum.REJECTED,
    ExchangeStatusEnum.CANCELED,
  ])
  status: string;
}
