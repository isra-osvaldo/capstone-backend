import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';

const providers = [PublishService];

@Module({
  imports: [MongoModule],
  controllers: [PublishController],
  providers: [...providers],
  exports: [...providers],
})
export class PublishModule {}
