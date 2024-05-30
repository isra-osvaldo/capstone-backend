import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calification } from '../schema/calification.schema';

@Injectable()
export class CalificationRepository {
  constructor(
    @InjectModel(Calification.name)
    private calificationModel: Model<Calification>,
  ) {}

  async create(calification: Calification): Promise<Calification> {
    const createdCalification = new this.calificationModel(calification);
    return createdCalification.save();
  }

  async findAllByOwnerUser(uuid_user: string): Promise<Calification[]> {
    return this.calificationModel.find({ uuid_user }).exec();
  }

  async findByExchangeAndUserCalification(
    uuid_exchange: string,
    uuid_user_calification: string,
  ): Promise<Calification> {
    return this.calificationModel
      .findOne({ 'exchange.uuid': uuid_exchange, uuid_user_calification })
      .exec();
  }

  async findByUuid(uuid: string): Promise<Calification> {
    return this.calificationModel.findOne({ uuid }).exec();
  }

  async patchByUuid(
    uuid: string,
    comment: string,
    calification: number,
  ): Promise<Calification> {
    return this.calificationModel
      .findOneAndUpdate({ uuid }, { comment, calification })
      .exec();
  }
}
