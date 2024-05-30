import { Injectable, Logger } from '@nestjs/common';
import { CreatePlan } from 'src/common/interface/plan.interface';
import { IUser } from 'src/common/interface/user.interface';
import { PlanRepository } from 'src/db/repository/plan.repository';
import { PlanBuilder } from './plan.builder';
import { Plan } from 'src/db/schema/plan.schema';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  constructor(private readonly planRepository: PlanRepository) {}

  async createPlan(body: CreatePlan, user: IUser): Promise<Plan> {
    this.logger.log(
      `Creando plan para el usuario ${user.sub} con body ${JSON.stringify(
        body,
      )}`,
    );

    const plan = new PlanBuilder()
      .uuid_user(user.sub)
      .type(body.type)
      .amount(body.amount)
      .order(body.order)
      .email(user.email)
      .name_user(user.name)
      .cant_exchange(body.type)
      .build();

    return this.planRepository.create(plan);
  }

  async getPlanByOrder(order: string): Promise<Plan> {
    this.logger.log(`Obteniendo plan con order ${order}`);
    return this.planRepository.findOne({ order });
  }

  async updatePlanDate(uuid: string) {
    this.logger.log(`Actualizando fecha de plan con uuid ${uuid}`);
    return this.planRepository.patch(uuid, {
      timestamp_start: new Date().getTime(),
      timestamp_end: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
    });
  }

  async getPlanActive(uuid_user: string): Promise<Plan> {
    this.logger.log(`Obteniendo plan activo del usuario ${uuid_user}`);
    return this.planRepository.findOne({
      uuid_user,
      timestamp_start: { $lt: new Date() },
      timestamp_end: { $gt: new Date() },
    });
  }

  async deletePlan(options: object) {
    this.logger.log(`Eliminando plan con options ${JSON.stringify(options)}`);
    return this.planRepository.delete(options);
  }
}
