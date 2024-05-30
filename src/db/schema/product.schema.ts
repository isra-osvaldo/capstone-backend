import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Product {
  constructor(product: Omit<Product, '_id' | 'uuid' | 'images'>) {
    this._id = new mongoose.Types.ObjectId();
    this.uuid = uuidv4();
    this.name = product.name;
    this.price = product.price;
    this.stock = product.stock;
    this.isNew = product.isNew;
    this.description = product.description;
    this.category = product.category;
    this.uuid_user = product.uuid_user;
    this.characteristics = product.characteristics;
    this.images = [];
    this.email = product.email;
  }

  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  isNew: boolean;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  uuid_user: string;

  @Prop({ required: true })
  images: string[];

  @Prop()
  characteristics: string[];

  @Prop({ required: true })
  email: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
