import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { ReputationService } from './reputation.service';
import { FindOneReponse } from './response/find-one.reponse';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  // Obtener la reputación de un usuario/comercio por su uuid de usuario
  @Get('/:uuid_user')
  @Public()
  async findReputation(
    @Param('uuid_user') uuid_user: string,
  ): Promise<FindOneReponse> {
    return await this.reputationService.getReputation(uuid_user);
  }
}
