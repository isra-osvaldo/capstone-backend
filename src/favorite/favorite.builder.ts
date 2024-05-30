import { Favorite } from 'src/db/schema/favorite.schema';
import { Publish } from 'src/db/schema/publish.schema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export class FavoriteBuilder {
  private favorite: Favorite;

  constructor() {
    this.favorite = new Favorite();
  }

  public uuid_user(uuid_user: string): FavoriteBuilder {
    this.favorite.uuid_user = uuid_user;
    return this;
  }

  public publish(publish: Publish): FavoriteBuilder {
    this.favorite.publish = publish;
    return this;
  }

  public build(): Favorite {
    this.favorite._id = new mongoose.Types.ObjectId();
    this.favorite.uuid = uuidv4();
    return this.favorite;
  }
}
