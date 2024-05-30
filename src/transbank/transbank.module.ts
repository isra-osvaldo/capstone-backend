import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { TransbankService } from './transbank.service';
import { TransbankController } from './transbank.controller';
import { PlanService } from 'src/plan/plan.service';
import { MailService } from 'src/mail/mail.service';

const providers = [TransbankService];

@Module({
  imports: [MongoModule],
  controllers: [TransbankController],
  providers: [...providers, PlanService, MailService],
  exports: [...providers],
})
export class TransbankModule {}
