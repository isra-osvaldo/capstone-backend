import { Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { ExchangeRepository } from 'src/db/repository/exchange.repository';
import { Exchange } from 'src/db/schema/exchange.schema';
import { CreateExchangeDTO } from './dto/create.dto';
import { ProductRepository } from 'src/db/repository/product.repository';
import { GetAllExchangeWantDTO } from './dto/getAllExchangeWant.dto';
import { GetAllExchangeRequestDTO } from './dto/getAllExchangeRequest.dto';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';
import { PublishRepository } from 'src/db/repository/publish.repository';
import { FavoriteRepository } from 'src/db/repository/favorite.repository';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  constructor(
    private readonly exchangeRepository: ExchangeRepository,
    private readonly productRepository: ProductRepository,
    private readonly publishRepository: PublishRepository,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  /**
   * Obtener todos los intercambios que un usuario/comercio quiere filtrado por status
   * @param status Estado del intercambio
   * @param user Usuario que quiere obtener los intercambios
   * @returns Todos los intercambios que un usuario/comercio quiere filtrado por status
   */
  async getAllExchangeWant(
    query: GetAllExchangeWantDTO,
    user: IUser,
  ): Promise<Exchange[]> {
    this.logger.log(
      `Buscando todos los intercambios que ${
        user.sub
      } quiere con filtro ${JSON.stringify(query)} `,
    );

    const queryFilter = {
      uuid_user_offer: user.sub,
    };

    if (query?.status) {
      queryFilter['status'] = query?.status;
    } else {
      queryFilter['status'] = {
        $nin: [ExchangeStatusEnum.ACCEPTED, ExchangeStatusEnum.FINISHED],
      };
    }

    if (query?.uuid_product_offer) {
      queryFilter['uuid_product_offer.uuid'] = query.uuid_product_offer;
    }

    return await this.exchangeRepository.getAllExchangeWant(queryFilter);
  }

  async getAllExchangeRequest(query: GetAllExchangeRequestDTO, user: IUser) {
    this.logger.log(
      `Buscando todos los intercambios que le ofrecen a ${
        user.sub
      } con filtro ${JSON.stringify(query)} `,
    );

    const queryFilter = {
      uuid_user_publish: user.sub,
    };

    if (query?.status) {
      queryFilter['status'] = query?.status;
    } else {
      queryFilter['status'] = {
        $nin: [ExchangeStatusEnum.ACCEPTED, ExchangeStatusEnum.FINISHED],
      };
    }

    if (query?.uuid_product_publish) {
      queryFilter['uuid_product_publish.uuid'] = query.uuid_product_publish;
    }

    return await this.exchangeRepository.getAllExchangeRequest(queryFilter);
  }

  async createExchange(
    body: CreateExchangeDTO,
    user: IUser,
  ): Promise<Exchange> {
    this.logger.log(`Creando intercambio para ${user.sub}`);

    this.logger.log(
      `Buscando producto ${body.uuid_product_want} que quiere ${user.sub}  `,
    );
    const productWant = await this.productRepository.findOne({
      uuid: body.uuid_product_want,
    });

    const productOffer = await this.productRepository.findOne({
      uuid: body.uuid_product_offer,
    });

    const exchange = new Exchange({
      uuid_product_publish: productWant,
      uuid_user_publish: productWant.uuid_user,
      uuid_product_offer: productOffer,
      uuid_user_offer: user.sub,
    });

    this.logger.log(`Creando intercambio para ${user.sub}`);
    const exchangeCreated = await this.exchangeRepository.createExchange(
      exchange,
    );

    // TODO: Enviar notificación al dueño del producto que quiere el usuario

    return exchangeCreated;
  }

  async getAllExchangeMatches(
    // query: GetAllExchangeMatchesDTO,
    user: IUser,
  ): Promise<Exchange[]> {
    this.logger.log(
      `Buscando todos los intercambios que coinciden para ${user.sub}`,
    );

    const queryFilter = {
      status: ExchangeStatusEnum.ACCEPTED,
      $or: [
        {
          uuid_user_publish: user.sub,
        },
        {
          uuid_user_offer: user.sub,
        },
      ],
    };

    return await this.exchangeRepository.getAllExchangeMatches(queryFilter);
  }

  async updateStatusExchange(
    uuid: string,
    status: string,
    user: IUser,
  ): Promise<Exchange> {
    this.logger.log(`Actualizando estado del intercambio ${uuid} a ${status}`);

    // Validar si status es aceptado, entonces descontar stock del producto y/o desactivarlo
    if (status === ExchangeStatusEnum.ACCEPTED) {
      await this.updateProductExchange(user, uuid);
    }

    return await this.exchangeRepository.updateStatusExchange(uuid, status);
  }

  private async updateProductExchange(user: IUser, uuid: string) {
    this.logger.log(`Actualizando producto del intercambio ${uuid}`);

    const exchange = await this.exchangeRepository.findOne({ uuid });

    const {
      uuid_product_publish: productRequest,
      uuid_product_offer: productOffer,
    } = exchange;

    // Descontar stock de cada producto
    const promises = [];

    promises.push(
      this.productRepository.descountStock(
        { uuid: productRequest.uuid },
        productOffer.stock,
      ),
    );

    promises.push(
      this.productRepository.descountStock(
        { uuid: productOffer.uuid },
        productRequest.stock,
      ),
    );

    this.logger.log(
      `Descontando stock de los productos del intercambio ${JSON.stringify(
        productRequest,
      )}}`,
    );
    if (productRequest.stock === 1) {
      this.logger.log(
        `Buscando publicación del producto ${productRequest.uuid}`,
      );
      const publishRequest = await this.publishRepository.findOne({
        uuid_product: productRequest.uuid,
      });

      // Desactivar publicación
      promises.push(
        this.publishRepository.desactivePublish({
          uuid: publishRequest.uuid,
        }),
      );

      // Actualizar estado de los intercambios que tengan este producto
      this.logger.log(
        `Actualizando estado de los intercambios que tengan el producto ${productRequest.uuid}`,
      );
      promises.push(
        this.exchangeRepository.updateStatusBulkExchange(
          productRequest.uuid,
          exchange.uuid,
        ),
      );

      this.logger.log(
        `Eliminando favoritos de la publicación ${publishRequest.uuid}`,
      );
      // Eliminar favoritos
      promises.push(
        this.favoriteRepository.deleteByPublish(publishRequest.uuid),
      );
    }

    this.logger.log(
      `Descontando stock de los productos del intercambio ${JSON.stringify(
        productOffer,
      )}}`,
    );
    if (productOffer.stock === 1) {
      this.logger.log(`Buscando publicación del producto ${productOffer.uuid}`);
      const publishOffer = await this.publishRepository.findOne({
        uuid_product: productOffer.uuid,
      });

      promises.push(
        this.publishRepository.desactivePublish({
          uuid: publishOffer.uuid,
        }),
      );

      // Actualizar estado de los intercambios que tengan este producto
      this.logger.log(
        `Actualizando estado de los intercambios que tengan el producto ${productOffer.uuid}`,
      );
      promises.push(
        this.exchangeRepository.updateStatusBulkExchange(
          productOffer.uuid,
          exchange.uuid,
        ),
      );

      this.logger.log(
        `Eliminando favoritos de la publicación ${publishOffer.uuid}`,
      );
      promises.push(this.favoriteRepository.deleteByPublish(publishOffer.uuid));
    }

    Promise.all(promises);
  }
}
