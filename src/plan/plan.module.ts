import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

const providers = [PlanService];

@Module({
  imports: [MongoModule],
  controllers: [PlanController],
  providers: [...providers],
  exports: [...providers],
})
export class PlanModule {}
