import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorMessage } from 'src/common/enums/error-message.enum';
import { ExchangeStatusEnum } from 'src/common/enums/exchange.enum';
import { ExchangeRepository } from 'src/db/repository/exchange.repository';
import { PlanRepository } from 'src/db/repository/plan.repository';
import { ProductRepository } from 'src/db/repository/product.repository';

@Injectable()
export class ValidateExchangeMiddleware implements NestMiddleware {
  constructor(
    private readonly exchangeRepository: ExchangeRepository,
    private readonly productRepository: ProductRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { uuid_product_offer, uuid_product_want } = req.body;
    // Verificar que los productos existan
    const promises = [
      this.productRepository.findOne({ uuid: uuid_product_want }),
      this.productRepository.findOne({ uuid: uuid_product_offer }),
    ];

    const [productWant, productOffer] = await Promise.all(promises);

    if (!productWant || !productOffer) {
      throw new ForbiddenException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    // Verificar que el producto que quiere el usuario no sea el mismo que ofrece
    if (productWant.uuid === productOffer.uuid) {
      throw new ForbiddenException(ErrorMessage.SAME_PRODUCT);
    }

    // Verificar que no exista un intercambio en curso con el mismo producto
    const exchange = await this.exchangeRepository.findOne({
      'uuid_product_offer.uuid': productOffer.uuid,
      'uuid_product_publish.uuid': productWant.uuid,
    });

    if (exchange) {
      throw new ForbiddenException(ErrorMessage.EXCHANGE_ALREADY_EXISTS);
    }

    // Buscar todos los intercambios que ha hecho el usuario en estado pending
    const exchangesPending = await this.exchangeRepository.getAllExchangeWant({
      uuid_user_offer: productOffer.uuid_user,
      status: ExchangeStatusEnum.PENDING,
    });

    //  Verificar el plan del usuario que quiere el producto
    const plan = await this.planRepository.findOne({
      uuid_user: productOffer.uuid_user,
      timestamp_start: { $lt: new Date() },
      timestamp_end: { $gt: new Date() },
    });

    if (!plan && exchangesPending.length >= 2) {
      throw new ForbiddenException(ErrorMessage.EXCHANGE_LIMIT);
    }

    if (plan?.cant_exchange <= exchangesPending.length) {
      throw new ForbiddenException(ErrorMessage.EXCHANGE_LIMIT);
    }

    next();
  }
}
