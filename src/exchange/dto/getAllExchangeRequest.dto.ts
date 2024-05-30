import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';

export class GetAllExchangeRequestDTO {
  @IsOptional({
    message: 'El estado debe ser uno de los siguientes: ' + ExchangeStatusEnum,
  })
  @IsIn([
    ExchangeStatusEnum.PENDING,
    ExchangeStatusEnum.REJECTED,
    ExchangeStatusEnum.CANCELED,
  ])
  status?: string;

  @IsOptional()
  @IsUUID()
  uuid_product_publish?: string;
}
