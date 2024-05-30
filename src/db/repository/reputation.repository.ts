import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reputation } from '../schema/reputation.schema';

@Injectable()
export class ReputationRepository {
  constructor(
    @InjectModel(Reputation.name) private reputationModel: Model<Reputation>,
  ) {}

  /**
   * Busca la reputación de un usuario o la crea si no existe
   * @param uuid_user Uuid del usuario
   * @returns Retorna la reputación del usuario
   */
  async findOneOrCreate(uuid_user: string, name: string): Promise<Reputation> {
    const reputation = await this.reputationModel.findOne({ uuid_user });
    if (reputation) {
      return reputation;
    }

    const newReputation = new Reputation({
      uuid_user,
      total_calification: 0,
      rating: 0,
      name,
    });

    const createReputation = new this.reputationModel(newReputation);
    return createReputation.save();
  }

  async findOne(uuid_user: string): Promise<Reputation> {
    return await this.reputationModel.findOne({ uuid_user });
  }

  async updateReputation(payload: object, uuid_user: string) {
    return await this.reputationModel.findOneAndUpdate({ uuid_user }, payload);
  }
}
