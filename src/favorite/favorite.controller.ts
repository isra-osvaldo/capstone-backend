import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from 'src/db/schema/favorite.schema';
import { IUser } from 'src/common/interface/user.interface';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { FavoriteDTO } from './dto/favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async findFavorites(@AuthenticatedUser() user: IUser): Promise<Favorite[]> {
    return await this.favoriteService.getAll(user.sub);
  }

  @Get('/:uuid_product')
  async findFavorite(
    @Param('uuid_product') uuid_product: string,
    @AuthenticatedUser() user: IUser,
  ): Promise<Favorite> {
    return await this.favoriteService.findOne(uuid_product, user.sub);
  }

  @Post()
  async createFavorite(
    @Body() body: FavoriteDTO,
    @AuthenticatedUser() user: IUser,
  ): Promise<Favorite> {
    return await this.favoriteService.create(body.uuid_product, user.sub);
  }

  @Delete('/:uuid')
  async deleteFavorite(
    @Param('uuid') uuid: string,
    @AuthenticatedUser() user: IUser,
  ): Promise<Favorite> {
    return await this.favoriteService.delete(uuid, user.sub);
  }
}
