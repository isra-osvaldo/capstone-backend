import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exchange } from '../schema/exchange.schema';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectModel(Exchange.name) private exchangeModel: Model<Exchange>,
  ) {}

  /**
   * Obtener todos los intercambios que un usuario/comercio quiere filtrado por status
   * @param status Estado del intercambio
   * @param uuid_user_offer uuid del usuario que quiere los productos
   * @returns Todos los intercambios que un usuario/comercio quiere filtrado por status
   */
  async getAllExchangeWant(object: object): Promise<Exchange[]> {
    return this.exchangeModel.find(object).sort({ updated_at: -1 }).exec();
  }

  async getAllExchangeRequest(object: object): Promise<Exchange[]> {
    return this.exchangeModel.find(object).sort({ updated_at: -1 }).exec();
  }

  async getAllExchangeMatches(object: object): Promise<Exchange[]> {
    // Ordenado por fecha de actualizacion
    return this.exchangeModel.find(object).sort({ updated_at: -1 }).exec();
  }

  async findOne(filter: object): Promise<Exchange> {
    return this.exchangeModel.findOne(filter).exec();
  }

  async createExchange(exchange: Exchange): Promise<Exchange> {
    const newExchange = new this.exchangeModel(exchange);
    return newExchange.save();
  }

  async getExchangeById(uuid: string): Promise<Exchange> {
    return this.exchangeModel.findOne({ uuid }).exec();
  }

  async updateStatusExchange(uuid: string, status: string): Promise<Exchange> {
    return this.exchangeModel.findOneAndUpdate({ uuid }, { status }).exec();
  }

  async updateStatusBulkExchange(product_uuid: string, exchange_uuid: string) {
    return this.exchangeModel.updateMany(
      {
        // 'uuid_product_offer.uuid': productOffer.uuid,
        $or: [
          {
            'uuid_product_publish.uuid': product_uuid,
          },
          {
            'uuid_product_offer.uuid': product_uuid,
          },
        ],
        uuid: { $ne: exchange_uuid },
        status: ExchangeStatusEnum.PENDING,
      },
      {
        status: ExchangeStatusEnum.CANCELED,
      },
    );
  }
}
