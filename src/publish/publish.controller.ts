import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { IUser } from 'src/common/interface/user.interface';
import { PublishService } from './publish.service';
import { Publish } from 'src/db/schema/publish.schema';
import { PublishDTO } from './dto/publish.dto';
import { PaginationParams } from './request/pagination.request';

@Controller('publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  // Obtener todas las publicaciones activas
  @Get()
  @Public()
  async findAllPublish(@Query() query: PaginationParams) {
    return await this.publishService.findAllPublishActive(query);
  }

  // Obtener las diez publicaciones de forma aleatoria
  @Get('/top')
  @Public()
  async findRandomTop(): Promise<Publish[]> {
    return await this.publishService.findRandomTop();
  }

  // Obtener todas las publicaciones por categoría
  @Get('/category/:uuid_category')
  @Public()
  async findAllByCategory(@Param('uuid_category') uuid_category: string) {
    return await this.publishService.findAllByCategoryUUID(uuid_category);
  }

  // Crear una publicación
  @Post()
  async create(
    @Body() body: PublishDTO,
    @AuthenticatedUser() user: IUser,
  ): Promise<Publish> {
    return await this.publishService.create(body, user);
  }

  // Obtener todas las publicaciones de un usuario/comercio
  @Get('/commerce/:uuid_user')
  @Public()
  async findAll(@Param('uuid_user') uuid_user: string) {
    return await this.publishService.findAllByUserUUID(uuid_user);
  }

  // Obtener 9 publicaciones de un usuario/comercio de forma aleatoria
  @Get('/commerce/random/:uuid_user')
  @Public()
  async findPublishByUser(@Param('uuid_user') uuid_user: string) {
    return await this.publishService.findPublishByUser(uuid_user);
  }
}
