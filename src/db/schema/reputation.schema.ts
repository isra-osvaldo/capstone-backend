import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Reputation {
  constructor(reputation: Omit<Reputation, '_id' | 'uuid'>) {
    this._id = new mongoose.Types.ObjectId();
    this.uuid = uuidv4();
    this.uuid_user = reputation.uuid_user;
    this.total_calification = reputation.total_calification;
    this.rating = reputation.rating;
    this.name = reputation.name;
  }
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop()
  uuid: string;

  @Prop()
  uuid_user: string;

  @Prop()
  total_calification: number;

  @Prop()
  rating: number;

  @Prop()
  name: string;
}

export const ReputationSchema = SchemaFactory.createForClass(Reputation);
