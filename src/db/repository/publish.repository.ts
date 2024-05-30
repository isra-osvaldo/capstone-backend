import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Publish } from '../schema/publish.schema';
import { PublishPaginate } from 'src/publish/response/findAll-paginate.response';

@Injectable()
export class PublishRepository {
  constructor(
    @InjectModel(Publish.name) private publishModel: PaginateModel<Publish>,
  ) {}

  /**
   * Busca todas las publicaciones
   * @param filter Filtro de búsqueda
   * @returns Lista de publicaciones
   */
  async findAll(filter: object, options?: object): Promise<PublishPaginate> {
    const resData = await this.publishModel.paginate(filter, {
      populate: 'reputationId',
      lean: true,
      ...options,
    });

    return resData as PublishPaginate;
  }

  async findPublishByUser(uuid_user: string): Promise<Publish[]> {
    return await this.publishModel.aggregate([
      { $match: { uuid_user, state: true } },
      // { $sample: { size: 9 } },
      {
        $lookup: {
          from: 'reputations',
          localField: 'reputationId',
          foreignField: '_id',
          as: 'reputationId',
        },
      },
    ]);
  }

  async findRandomTop(): Promise<Publish[]> {
    return await this.publishModel.aggregate([
      { $match: { state: true } },
      { $sample: { size: 9 } },
      {
        $lookup: {
          from: 'reputations',
          localField: 'reputationId',
          foreignField: '_id',
          as: 'reputationId',
        },
      },
    ]);
  }

  /**
   * Busca una publicación
   * @param filter Filtro de búsqueda
   * @returns Publicación
   */
  async findOne(filter: object): Promise<Publish> {
    return this.publishModel.findOne(filter).exec();
  }

  /**
   * Crea una publicación
   * @param publish Publicación a crear
   * @returns Publicación creada
   */
  async create(publish: Publish): Promise<Publish> {
    const createPublish = new this.publishModel(publish);
    return createPublish.save();
  }

  /**
   * Actualiza una publicación
   * @param filter Filtro de búsqueda
   * @param publish Publicación a actualizar
   * @returns Publicación actualizada
   */
  async update(filter: object, publish: Partial<Publish>): Promise<Publish> {
    return this.publishModel.findOneAndUpdate(filter, publish).exec();
  }

  /**
   * Sube una imagen a una publicación
   * @param filter Filtro de búsqueda
   * @param image Dirección de la imagen
   * @returns Publicación actualizada
   */
  async uploadImage(filter: object, image: string): Promise<Publish> {
    return this.publishModel.findOneAndUpdate(filter, { image }).exec();
  }

  async desactivePublish(filter: object): Promise<Publish> {
    return this.publishModel.findOneAndUpdate(filter, { state: false }).exec();
  }
}
