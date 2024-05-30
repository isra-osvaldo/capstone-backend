import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { CalificationService } from './calification.service';
import { CalificationController } from './calification.controller';

const providers = [CalificationService];

@Module({
  imports: [MongoModule],
  controllers: [CalificationController],
  providers: [...providers],
  exports: [...providers],
})
export class CalificationModule {}
