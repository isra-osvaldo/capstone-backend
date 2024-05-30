import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../schema/favorite.schema';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async getAll(object: object): Promise<Favorite[]> {
    return this.favoriteModel.find(object).exec();
  }

  async findOne(object: object): Promise<Favorite> {
    return this.favoriteModel.findOne(object).exec();
  }

  async create(favorite: Favorite): Promise<Favorite> {
    const newFavorite = new this.favoriteModel(favorite);
    return newFavorite.save();
  }

  async delete(uuid: string): Promise<Favorite> {
    return this.favoriteModel.findOneAndDelete({ uuid }).exec();
  }

  async deleteByPublish(uuid_publish: string) {
    return this.favoriteModel
      .deleteMany({
        'publish.uuid': uuid_publish,
      })
      .exec();
  }
}
