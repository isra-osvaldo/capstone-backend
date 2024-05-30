import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Plan } from 'src/db/schema/plan.schema';
import { PlanEnum } from 'src/common/enums/plan.enum';

export class PlanBuilder {
  private plan: Plan;

  constructor() {
    this.plan = new Plan();
  }

  public uuid_user(uuid_user: string): PlanBuilder {
    this.plan.uuid_user = uuid_user;
    return this;
  }

  public type(type: string): PlanBuilder {
    this.plan.type = type;
    return this;
  }

  public amount(amount: number): PlanBuilder {
    this.plan.amount = amount;
    return this;
  }

  public name_user(name_user: string): PlanBuilder {
    this.plan.name_user = name_user;
    return this;
  }

  public email(email: string): PlanBuilder {
    this.plan.email = email;
    return this;
  }

  public order(order: string): PlanBuilder {
    this.plan.order = order;
    return this;
  }

  public cant_exchange(type: string): PlanBuilder {
    if (PlanEnum.BASIC === type) {
      this.plan.cant_exchange = 5;
      return this;
    }

    this.plan.cant_exchange = 15;
    return this;
  }

  public build(): Plan {
    this.plan._id = new mongoose.Types.ObjectId();
    this.plan.uuid = uuidv4();

    return this.plan;
  }
}
