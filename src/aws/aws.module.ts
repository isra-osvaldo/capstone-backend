import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { S3Service } from './s3.service';
import { AwsController } from './aws.controller';

const providers = [S3Service];

@Module({
  imports: [MongoModule],
  controllers: [AwsController],
  providers: [...providers],
  exports: [...providers],
})
export class AWSModule {}
