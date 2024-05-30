import { IsEnum, IsString } from 'class-validator';
import { PlanEnum } from 'src/common/enums/plan.enum';

export class TransactionDTO {
  @IsString()
  amount: string;

  @IsEnum([PlanEnum.BASIC, PlanEnum.PREMIUM])
  type: string;

  @IsString()
  buyOrder: string;

  @IsString()
  sessionId: string;
}
