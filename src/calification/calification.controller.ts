import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { CalificationService } from './calification.service';
import { CreateDTO } from './dto/create.dto';
import { Calification } from 'src/db/schema/calification.schema';

@Controller('calification')
export class CalificationController {
  constructor(private readonly calificationService: CalificationService) {}

  @Post()
  async createCalification(
    @Body() body: CreateDTO,
    @AuthenticatedUser() user: IUser,
  ): Promise<Calification> {
    return await this.calificationService.createCalification(body, user);
  }

  @Get('/exchange/:uuid_exchange')
  async getCalificationByExchange(
    @Param('uuid_exchange') uuid_exchange: string,
    @AuthenticatedUser() user: IUser,
  ): Promise<Calification> {
    return await this.calificationService.getCalificationByExchange(
      uuid_exchange,
      user,
    );
  }

  @Put('/:uuid_calification')
  async patchByExchange(
    @Param('uuid_calification') uuid_calification: string,
    @Body() body: CreateDTO,
    @AuthenticatedUser() user: IUser,
  ): Promise<void> {
    return await this.calificationService.updateCalification(
      body,
      user,
      uuid_calification,
    );
  }
}
