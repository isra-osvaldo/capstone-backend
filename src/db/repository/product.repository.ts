import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schema/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  /**
   * Busca todos los productos
   * @param filter Filtro de búsqueda
   * @returns Lista de productos
   */
  async findAll(filter: object): Promise<Product[]> {
    return this.productModel.find(filter).exec();
  }

  /**
   * Busca un producto
   * @param filter Filtro de búsqueda
   * @returns Producto
   */
  async findOne(filter: object): Promise<Product> {
    return this.productModel.findOne(filter).exec();
  }

  /**
   * Crea un producto
   * @param product Producto a crear
   * @returns Producto creado
   */
  async create(product: Product): Promise<Product> {
    const createProduct = new this.productModel(product);
    return createProduct.save();
  }

  /**
   * Actualiza un producto
   * @param filter Filtro de búsqueda
   * @param product Producto a actualizar
   * @returns Producto actualizado
   */
  async update(filter: object, product: Partial<Product>): Promise<Product> {
    return this.productModel.findOneAndUpdate(filter, product).exec();
  }

  /**
   * Metodo para subir imágenes a un producto
   * @param filter Filtro de búsqueda
   * @param images Imágenes a subir
   * @returns Producto actualizado
   */
  async uploadImages(filter: object, images: string[]): Promise<Product> {
    return this.productModel.findOneAndUpdate(filter, { images }).exec();
  }

  async descountStock(filter: object, stockNow: number): Promise<Product> {
    return this.productModel
      .findOneAndUpdate(filter, { stock: stockNow - 1 })
      .exec();
  }
}
