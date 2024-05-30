import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan } from '../schema/plan.schema';

@Injectable()
export class PlanRepository {
  constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {}

  async getAll(object: object): Promise<Plan[]> {
    return this.planModel.find(object).exec();
  }

  async findOne(object: object): Promise<Plan> {
    return this.planModel.findOne(object).exec();
  }

  async create(plan: Plan): Promise<Plan> {
    const newFavorite = new this.planModel(plan);
    return newFavorite.save();
  }

  async patch(uuid: string, object: object): Promise<Plan> {
    return this.planModel.findOneAndUpdate({ uuid }, object).exec();
  }

  async delete(object: object): Promise<Plan> {
    return this.planModel.findOneAndDelete(object).exec();
  }
}
