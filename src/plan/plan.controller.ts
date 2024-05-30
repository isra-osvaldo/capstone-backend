import { Controller, Get } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { IUser } from 'src/common/interface/user.interface';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getPlan(@AuthenticatedUser() user: IUser) {
    return await this.planService.getPlanActive(user.sub);
  }
}
