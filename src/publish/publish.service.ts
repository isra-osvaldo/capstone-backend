import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { PublishRepository } from 'src/db/repository/publish.repository';
import { Publish } from 'src/db/schema/publish.schema';
import { PublishDTO } from './dto/publish.dto';
import { ProductRepository } from 'src/db/repository/product.repository';
import { PublishCreateRequest } from './request/publish-create.request';
import { ReputationRepository } from 'src/db/repository/reputation.repository';
import { PublishPaginate } from './response/findAll-paginate.response';
import { PaginationParams } from './request/pagination.request';

@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);
  constructor(
    private readonly publishRepository: PublishRepository,
    private readonly productRepository: ProductRepository,
    private readonly reputationRepository: ReputationRepository,
  ) {}

  /**
   * Busca todas las publicaciones de un usuario/comercio
   * @param uuid_user UUID del usuario/comercio
   * @returns Publish[]
   */
  async findAllByUserUUID(uuid_user: string) {
    this.logger.log(
      `Buscando las publicaciones del usuario/comercio ${uuid_user}`,
    );

    return this.publishRepository.findAll({
      uuid_user,
      state: true,
    });
  }

  /**
   * Busca todas las publicaciones activas
   * @returns Publish[]
   */
  async findAllPublishActive(
    query: PaginationParams,
  ): Promise<PublishPaginate> {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };

    const filter = {
      state: true,
    };

    if (query.search) {
      filter['$text'] = { $search: query.search };
    }

    if (query.category) {
      filter['category'] = { $regex: query.category, $options: 'i' };
    }

    this.logger.log(
      `Buscando todas las publicaciones con filtro ${JSON.stringify(filter)}`,
    );
    return await this.publishRepository.findAll(filter, options);
  }

  /**
   * Busca las diez publicaciones más recientes
   * @returns
   */
  async findRandomTop(): Promise<Publish[]> {
    this.logger.log(`Buscando las diez publicaciones más recientes`);
    const response = await this.publishRepository.findRandomTop();

    return response.map((item) => {
      const reputation = item.reputationId[0];

      const rating = reputation.rating / reputation.total_calification;

      reputation.rating = rating;

      return {
        ...item,
        reputationId: reputation,
      };
    });
  }

  /**
   * Busca las publicaciones de un usuario/comercio de forma aleatoria
   * @param uuid_user UUID del usuario/comercio
   * @returns Retorna 9 publicaciones de un usuario/comercio de forma aleatoria
   */
  async findPublishByUser(uuid_user: string): Promise<Publish[]> {
    this.logger.log(
      `Buscando las publicaciones de forma aleatoria del usuario/comercio ${uuid_user}`,
    );
    const response = await this.publishRepository.findPublishByUser(uuid_user);

    return response.map((item) => {
      return {
        ...item,
        reputationId: item.reputationId[0],
      };
    });
  }

  /**
   * Busca las publicaciones por categoría
   * @param uuid_category UUID de la categoría
   * @returns Publish[]
   */
  async findAllByCategoryUUID(uuid_category: string) {
    this.logger.log(
      `Buscando las publicaciones de la categoría ${uuid_category}`,
    );
    return this.publishRepository.findAll({ uuid_category, state: true });
  }

  /**
   * Crea una publicación
   * @param body Body de la publicación
   * @param user Usuario/comercio que crea la publicación
   * @returns Publish
   */
  async create(body: PublishDTO, user: IUser): Promise<Publish> {
    this.logger.log(`Creando publicación para usuario/comercio ${user.sub}`);

    const publishExists = await this.publishRepository.findOne({
      uuid_product: body.uuid_product,
      uuid_user: user.sub,
      state: true,
    });

    if (publishExists) {
      throw new BadRequestException(
        'Ya existe una publicación con este producto',
      );
    }

    this.logger.log(`Buscando producto ${body.uuid_product}`);
    const product = await this.productRepository.findOne({
      uuid: body.uuid_product,
    });

    this.logger.log(`Guardando reputación`);
    const reputation = await this.reputationRepository.findOneOrCreate(
      user.sub,
      user.name,
    );

    const payload: PublishCreateRequest = {
      uuid_product: body.uuid_product,
      uuid_user: user.sub,
      name: product.name,
      price: product.price,
      publish_description: body.publish_description,
      category: product.category,
      reputationId: reputation._id,
      email: user.email,
    };

    this.logger.log(`Creando publicación con datos ${JSON.stringify(payload)}`);
    const publish = new Publish(payload);

    this.logger.log(`Guardando publicación`);
    return await this.publishRepository.create(publish);
  }

  // TODO: Implementar update
}
