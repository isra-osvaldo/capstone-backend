import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PlanEnum } from 'src/common/enums/plan.enum';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Plan {
  @Prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  uuid_user: string;

  @Prop({ required: true, enum: PlanEnum })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  order: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name_user: string;

  @Prop({ default: null })
  timestamp_start: Date;

  @Prop({ default: null })
  timestamp_end: Date;

  @Prop()
  cant_exchange: number;
}

export const planSchema = SchemaFactory.createForClass(Plan);
