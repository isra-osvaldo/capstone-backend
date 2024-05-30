import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';
import { Product } from './product.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Exchange {
  constructor(exchange: Omit<Exchange, '_id' | 'uuid' | 'status'>) {
    this._id = new mongoose.Types.ObjectId();
    this.uuid = uuidv4();
    this.uuid_product_publish = exchange.uuid_product_publish;
    this.uuid_user_publish = exchange.uuid_user_publish;
    this.uuid_product_offer = exchange.uuid_product_offer;
    this.uuid_user_offer = exchange.uuid_user_offer;
    this.status = ExchangeStatusEnum.PENDING;
  }

  @Prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;

  // Producto que quiere el usuario
  @Prop({ required: true, type: Product })
  uuid_product_publish: Product;

  @Prop({ required: true }) // uuid del usuario que pertenece el producto
  uuid_user_publish: string;

  // Producto que ofrece el usuario
  @Prop({ required: true, type: Product })
  uuid_product_offer: Product;

  @Prop({ required: true }) // uuid del usuario que quiere el producto
  uuid_user_offer: string;

  @Prop({ enum: ExchangeStatusEnum, required: true })
  status: string;
}

export const exchangeSchema = SchemaFactory.createForClass(Exchange);
