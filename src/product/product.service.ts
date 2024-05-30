import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { ProductRepository } from 'src/db/repository/product.repository';
import { Product } from 'src/db/schema/product.schema';
import { ProductDTO } from './dto/product.dto';
import { PublishRepository } from 'src/db/repository/publish.repository';
import { Publish } from 'src/db/schema/publish.schema';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly publishRepository: PublishRepository,
  ) {}

  /**
   * Busca todos los productos de un usuario/comercio
   * @param uuid_user UUID del usuario/comercio
   * @returns Product[]
   */
  async findAllByUserUUID(uuid_user: string): Promise<Product[]> {
    this.logger.log(`Buscando los productos del usuario/comercio ${uuid_user}`);

    return this.productRepository.findAll({ uuid_user });
  }

  /**
   * Busca un producto por su UUID
   * @param uuid UUID del usuario/comercio
   * @returns Product
   */
  async findOneByUUID(uuid: string): Promise<Product> {
    this.logger.log(`Buscando producto de usuario/comercio por ${uuid}`);
    return this.productRepository.findOne({ uuid });
  }

  /**
   * Crea un producto para un usuario/comercio con su publicación
   * @param body Body de la petición
   * @param user Usuario/comercio
   * @returns Product
   */
  async create(body: ProductDTO, user: IUser): Promise<Product> {
    this.logger.log(`Creando producto para usuario/comercio ${user.sub}`);

    const productExists = await this.productRepository.findOne({
      name: body.name,
      uuid_user: user.sub,
    });

    if (productExists) {
      throw new BadRequestException('Ya existe un producto con ese nombre');
    }

    const product = new Product({
      ...body,
      uuid_user: user.sub,
      email: user.email,
    });

    return this.productRepository.create(product);
  }
}
