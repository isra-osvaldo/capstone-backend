import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

const providers = [ProductService];

@Module({
  imports: [MongoModule],
  controllers: [ProductController],
  providers: [...providers],
  exports: [...providers],
})
export class ProductModule {}
