import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Publish } from './publish.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Favorite {
  @Prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  uuid_user: string;

  @Prop({ required: true, type: Publish })
  publish: Publish;
}

export const favoriteSchema = SchemaFactory.createForClass(Favorite);
