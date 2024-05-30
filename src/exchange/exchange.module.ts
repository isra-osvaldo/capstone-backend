import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ValidateExchangeMiddleware } from './middleware/validExchange.middleware';

const providers = [ExchangeService];

@Module({
  imports: [MongoModule],
  controllers: [ExchangeController],
  providers: [...providers],
  exports: [...providers],
})
export class ExchangeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateExchangeMiddleware).forRoutes({
      path: 'exchange',
      method: RequestMethod.POST,
    });
  }
}
