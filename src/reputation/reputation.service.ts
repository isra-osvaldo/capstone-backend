import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReputationRepository } from 'src/db/repository/reputation.repository';
import { FindOneReponse } from './response/find-one.reponse';

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);
  constructor(private readonly reputationRepository: ReputationRepository) {}

  /**
   * Busca la reputación de un usuario
   * @param uuid_user Uuid del usuario
   * @returns Retorna la reputación del usuario
   */
  async getReputation(uuid_user: string): Promise<FindOneReponse> {
    this.logger.log(`Buscando la reputación del usuario/comercio ${uuid_user}`);

    const reputation = await this.reputationRepository.findOne(uuid_user);

    if (!reputation) {
      throw new BadRequestException('No se encontró la reputación');
    }

    return {
      uuid: reputation.uuid,
      total_calification: reputation.total_calification,
      rating: reputation.rating,
      name: reputation.name,
    };
  }
}
