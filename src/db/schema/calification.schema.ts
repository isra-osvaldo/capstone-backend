import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exchange } from './exchange.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Calification {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  uuid_user: string; // uuid que pertenece al dueño de la publicacion

  @Prop({ required: true })
  uuid_user_calification: string; // uuid del usuario que califica

  @Prop({ required: true, type: Exchange })
  exchange: Exchange; // El intercambio que se realizo

  @Prop({ required: true, min: 1, max: 5 }) // de 1 a 5
  calification: number;

  @Prop({ required: true, length: 500 }) // comentario del usuario
  comment: string;
}

export const calificationSchema = SchemaFactory.createForClass(Calification);
