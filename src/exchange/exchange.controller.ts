import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { IUser } from 'src/common/interface/user.interface';
import { ExchangeService } from './exchange.service';
import { GetAllExchangeWantDTO } from './dto/getAllExchangeWant.dto';
import { Exchange } from 'src/db/schema/exchange.schema';
import { CreateExchangeDTO } from './dto/create.dto';
import { GetAllExchangeRequestDTO } from './dto/getAllExchangeRequest.dto';
import { GetAllExchangeMatchesDTO } from './dto/getAllExchangeMatches.dto';
import { PatchStatusDTO } from './dto/patchStatus.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  // Obtener todos los intercambios que un usuario/comercio quiere filtrado por status
  @Get('/want')
  async findAllExchangeWant(
    @AuthenticatedUser() user: IUser,
    @Query() query: GetAllExchangeWantDTO,
  ): Promise<Exchange[]> {
    return await this.exchangeService.getAllExchangeWant(query, user);
  }

  @Get('/request')
  async findAllExchangeRequest(
    @AuthenticatedUser() user: IUser,
    @Query() query: GetAllExchangeRequestDTO,
  ): Promise<Exchange[]> {
    return await this.exchangeService.getAllExchangeRequest(query, user);
  }

  @Get('/matches')
  async findAllExchangeMatches(
    @AuthenticatedUser() user: IUser,
    // @Query() query: GetAllExchangeMatchesDTO,
  ): Promise<Exchange[]> {
    return await this.exchangeService.getAllExchangeMatches(user);
  }

  // Crear un intercambio
  @Post()
  async createExchange(
    @AuthenticatedUser() user: IUser,
    @Body() body: CreateExchangeDTO,
  ): Promise<Exchange> {
    return await this.exchangeService.createExchange(body, user);
  }

  @Patch('/status/:uuid')
  async updateStatusExchange(
    @AuthenticatedUser() user: IUser,
    @Body() body: PatchStatusDTO,
    @Param() param: { uuid: string },
  ): Promise<Exchange> {
    return await this.exchangeService.updateStatusExchange(
      param.uuid,
      body.status,
      user,
    );
  }
}
