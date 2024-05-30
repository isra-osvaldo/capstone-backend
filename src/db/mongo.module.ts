import { Module } from '@nestjs/common';
import { MongooseConfigService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRepository } from './repository/product.repository';
import { PublishRepository } from './repository/publish.repository';
import { Product, ProductSchema } from './schema/product.schema';
import { Publish, PublishSchema } from './schema/publish.schema';
import { Reputation, ReputationSchema } from './schema/reputation.schema';
import { Calification, calificationSchema } from './schema/calification.schema';
import { ReputationRepository } from './repository/reputation.repository';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Exchange, exchangeSchema } from './schema/exchange.schema';
import { ExchangeRepository } from './repository/exchange.repository';
import { Favorite, favoriteSchema } from './schema/favorite.schema';
import { FavoriteRepository } from './repository/favorite.repository';
import { Plan, planSchema } from './schema/plan.schema';
import { PlanRepository } from './repository/plan.repository';
import { CalificationRepository } from './repository/calification.repository';

const providers = [
  MongooseConfigService,
  ProductRepository,
  PublishRepository,
  ReputationRepository,
  ExchangeRepository,
  FavoriteRepository,
  PlanRepository,
  CalificationRepository,
];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.set('collection', `products`);
          return schema;
        },
      },
      {
        name: Publish.name,
        useFactory: () => {
          const schema = PublishSchema;
          schema.plugin(mongoosePaginate);
          schema.set('collection', `publishes`);
          return schema;
        },
      },
      {
        name: Reputation.name,
        useFactory: () => {
          const schema = ReputationSchema;
          schema.set('collection', `reputations`);
          return schema;
        },
      },
      {
        name: Calification.name,
        useFactory: () => {
          const schema = calificationSchema;
          schema.set('collection', `califications`);
          return schema;
        },
      },
      {
        name: Exchange.name,
        useFactory: () => {
          const schema = exchangeSchema;
          schema.set('collection', `exchanges`);
          return schema;
        },
      },
      {
        name: Favorite.name,
        useFactory: () => {
          const schema = favoriteSchema;
          schema.set('collection', `favorites`);
          return schema;
        },
      },
      {
        name: Plan.name,
        useFactory: () => {
          const schema = planSchema;
          schema.set('collection', `plans`);
          return schema;
        },
      },
    ]),
  ],
  providers: [...providers],
  exports: [...providers],
})
export class MongoModule {}
