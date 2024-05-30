import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { IUser } from 'src/common/interface/user.interface';
import { ProductService } from './product.service';
import { Product } from 'src/db/schema/product.schema';
import { ProductDTO } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Obtener un producto por su UUID
  @Get(':uuid')
  @Public()
  async findOneByUUID(@Param('uuid') uuid: string): Promise<Product> {
    return await this.productService.findOneByUUID(uuid);
  }

  // Obtener todos los productos de un usuario/comercio
  @Get('/commerce/:uuid_user')
  @Public()
  async findAll(@Param('uuid_user') uuid_user: string): Promise<Product[]> {
    return await this.productService.findAllByUserUUID(uuid_user);
  }

  // Crear un producto para un usuario/comercio
  @Post()
  async create(
    @Body() body: ProductDTO,
    @AuthenticatedUser() user: IUser,
  ): Promise<Product> {
    return await this.productService.create(body, user);
  }
}
