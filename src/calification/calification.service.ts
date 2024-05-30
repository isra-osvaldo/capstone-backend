import { Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { CalificationRepository } from 'src/db/repository/calification.repository';
import { CalificationBuilder } from './calification.builder';
import { ExchangeRepository } from 'src/db/repository/exchange.repository';
import { ReputationRepository } from 'src/db/repository/reputation.repository';
import { CreateDTO } from './dto/create.dto';
import { Calification } from 'src/db/schema/calification.schema';

@Injectable()
export class CalificationService {
  private readonly logger = new Logger(CalificationService.name);
  constructor(
    private readonly calificationRepository: CalificationRepository,
    private readonly exchangeRepository: ExchangeRepository,
    private readonly reputationRepository: ReputationRepository,
  ) {}

  async createCalification(body: CreateDTO, user: IUser) {
    this.logger.log(`
    Creando calificacion para el usuario ${
      user.sub
    } con el body ${JSON.stringify(body)}`);

    const exchange = await this.exchangeRepository.getExchangeById(
      body.uuid_exchange,
    );

    const calificationBuilder = new CalificationBuilder()
      .uuid_user(body.uuid_user)
      .uuid_user_calification(user.sub)
      .uuid_exchange(exchange)
      .comment(body.comment)
      .evaluation(body.evaluation)
      .build();

    const reputation = await this.reputationRepository.findOne(body.uuid_user);

    const total_calification = reputation.total_calification + 1;

    const rating = reputation.rating + body.evaluation;

    const payload = {
      total_calification,
      rating,
    };

    const promises = [];

    promises.push(
      this.reputationRepository.updateReputation(payload, body.uuid_user),
    );

    await Promise.all(promises);

    return await this.calificationRepository.create(calificationBuilder);
  }

  async getCalificationByExchange(uuid_exchange: string, user: IUser) {
    this.logger.log(`
    Obteniendo calificacion de un intercambio para el usuario ${user.sub} con el uuid_exchange ${uuid_exchange}`);

    return await this.calificationRepository.findByExchangeAndUserCalification(
      uuid_exchange,
      user.sub,
    );
  }

  async updateCalification(
    body: CreateDTO,
    user: IUser,
    uuid_calification: string,
  ): Promise<void> {
    this.logger.log(
      `Actualizando calificacion para el usuario ${
        user.sub
      } con el body ${JSON.stringify(body)}`,
    );

    const calificationOld = await this.calificationRepository.findByUuid(
      uuid_calification,
    );

    const reputation = await this.reputationRepository.findOne(body.uuid_user);

    const difference = calificationOld.calification - body.evaluation;

    const payload = {
      rating: reputation.rating - difference,
    };

    const promises = [];

    promises.push(
      this.calificationRepository.patchByUuid(
        uuid_calification,
        body.comment,
        body.evaluation,
      ),
    );

    promises.push(
      this.reputationRepository.updateReputation(payload, body.uuid_user),
    );

    await Promise.all(promises);

    // await this.calificationRepository.patchByUuid(
    //   uuid_calification,
    //   body.comment,
    //   body.evaluation,
    // );
    // await this.reputationRepository.updateReputation(payload, body.uuid_user);

    return;
  }
}
