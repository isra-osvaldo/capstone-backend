import { Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { WebpayPlus } from 'transbank-sdk';
import { TransactionDTO } from './dto/create-transaction.dto';
import { WebhookDTO } from './dto/webhook.dto';
import { TransactionAccepted } from './interfaces/transaction.interface';
import { TRANSBANK_RETURN_URL } from 'src/config/constants';
import { PlanService } from 'src/plan/plan.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TransbankService {
  private readonly logger = new Logger(TransbankService.name);
  constructor(
    private readonly planService: PlanService,
    private readonly mailService: MailService,
  ) {}

  async createTransaction(body: TransactionDTO, user: IUser) {
    this.logger.log(
      `Creando transacción para el usuario ${
        user.sub
      } con body ${JSON.stringify(body)}`,
    );
    const options = WebpayPlus.getDefaultOptions();

    const transaction = await new WebpayPlus.Transaction(options).create(
      body.buyOrder,
      body.sessionId,
      +body.amount,
      TRANSBANK_RETURN_URL,
    );

    await this.planService.createPlan(
      {
        type: body.type,
        amount: +body.amount,
        order: body.buyOrder,
      },
      user,
    );

    return transaction;
  }

  async Webhook(query: WebhookDTO) {
    this.logger.log(`Webhook recibido con query ${JSON.stringify(query)}`);
    const options = WebpayPlus.getDefaultOptions();

    const tx = new WebpayPlus.Transaction(options);

    this.logger.log(`Consultando transacción con token ${query.token_ws}`);
    const response: TransactionAccepted = await tx.commit(query.token_ws);

    const plan = await this.planService.getPlanByOrder(response.buy_order);

    const promises = [
      this.mailService.sendPayment({
        amount: response.amount,
        email: plan.email,
        name: plan.name_user,
        order: response.buy_order,
        plan_type: plan.type,
        transaction_date: response.transaction_date,
      }),
      this.planService.updatePlanDate(plan.uuid),
      this.planService.deletePlan({
        uuid_user: plan.uuid_user,
        order: { $ne: plan.order },
      }),
    ];

    await Promise.allSettled(promises);

    return response;
  }
}
