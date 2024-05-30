import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReputationRepository } from 'src/db/repository/reputation.repository';
import { FavoriteRepository } from 'src/db/repository/favorite.repository';
import { Favorite } from 'src/db/schema/favorite.schema';
import { PublishRepository } from 'src/db/repository/publish.repository';
import { FavoriteBuilder } from './favorite.builder';

@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly publishRepository: PublishRepository,
  ) {}

  async getAll(uuid_user: string): Promise<Favorite[]> {
    this.logger.log(`Buscando todos los favoritos del usuario ${uuid_user}`);

    return await this.favoriteRepository.getAll({ uuid_user });
  }

  async findOne(uuid_product: string, uuid_user: string): Promise<Favorite> {
    this.logger.log(
      `Buscando el favorito del usuario ${uuid_user} para el producto ${uuid_product}`,
    );

    const publish = await this.publishRepository.findOne({
      uuid_product,
    });

    return await this.favoriteRepository.findOne({
      uuid_user,
      'publish.uuid': publish.uuid,
    });
  }

  async create(uuid_product: string, uuid_user: string): Promise<Favorite> {
    this.logger.log(`Creando un favorito para el publicación ${uuid_product}`);

    const publish = await this.publishRepository.findOne({
      uuid_product,
    });

    const favorite = new FavoriteBuilder()
      .uuid_user(uuid_user)
      .publish(publish)
      .build();

    return await this.favoriteRepository.create(favorite);
  }

  async delete(uuid: string, uuid_user: string): Promise<Favorite> {
    this.logger.log(`Eliminando el favorito ${uuid}`);

    const favorite = await this.favoriteRepository.findOne({
      uuid,
      uuid_user,
    });

    if (!favorite) {
      throw new BadRequestException('No existe el favorito');
    }

    return await this.favoriteRepository.delete(uuid);
  }
}
