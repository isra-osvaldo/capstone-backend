import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';

const providers = [ReputationService];

@Module({
  imports: [MongoModule],
  controllers: [ReputationController],
  providers: [...providers],
  exports: [...providers],
})
export class ReputationModule {}
