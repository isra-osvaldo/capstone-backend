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
export class Publish {
  constructor(publish: Omit<Publish, '_id' | 'uuid' | 'image' | 'state'>) {
    this._id = new mongoose.Types.ObjectId();
    this.uuid = uuidv4();
    this.uuid_product = publish.uuid_product;
    this.uuid_user = publish.uuid_user;
    this.category = publish.category;
    this.name = publish.name;
    this.price = publish.price;
    this.publish_description = publish.publish_description;
    this.image = '';
    this.state = true;
    this.reputationId = publish.reputationId;
  }

  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  uuid_product: string;

  @Prop({ required: true })
  uuid_user: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, text: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;

  @Prop()
  publish_description: string;

  @Prop({ required: true })
  state: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reputation' })
  reputationId: mongoose.Types.ObjectId;
}

export const PublishSchema = SchemaFactory.createForClass(Publish);
