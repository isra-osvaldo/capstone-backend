import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Payment } from 'src/common/interface/payment.interface';
import TransformUtils from 'src/common/utils/transform.utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(sendMailOptions: ISendMailOptions) {
    try {
      return await this.mailerService.sendMail(sendMailOptions);
    } catch (err) {
      console.log(err);
      this.logger.error(`Error al enviar un email: ${JSON.stringify(err)}`);
    }
  }

  async sendPayment(payment: Payment) {
    return await this.sendEmail({
      to: payment.email,
      subject: 'NotBuy - Verificación de pago',
      template: './payment',
      context: {
        name: payment.name,
        amount: TransformUtils.formattedAmount(payment.amount),
        order: payment.order,
        transaction_date: TransformUtils.formattedDate(
          payment.transaction_date,
        ),
        plan_type: payment.plan_type,
      },
    });
  }
}
