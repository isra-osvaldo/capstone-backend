import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { TransbankService } from './transbank.service';
import { IUser } from 'src/common/interface/user.interface';
import { TransactionDTO } from './dto/create-transaction.dto';
import { Response } from 'express';
import { WebhookDTO } from './dto/webhook.dto';
import TransformUtils from 'src/common/utils/transform.utils';

@Controller('transbank')
export class TransbankController {
  constructor(private readonly transbankService: TransbankService) {}

  @Get()
  async createTransaction(
    @Query() query: TransactionDTO,
    @AuthenticatedUser() user: IUser,
    @Res() res: Response,
  ) {
    const transaction = await this.transbankService.createTransaction(
      query,
      user,
    );

    return res.render('create-transaction', {
      token: transaction.token,
      url: transaction.url,
    });
  }

  @Get('webhook')
  @Public()
  async Webhook(@Query() query: WebhookDTO, @Res() res: Response) {
    const transaction = await this.transbankService.Webhook(query);

    const formattedDate = TransformUtils.formattedDate(
      transaction.transaction_date,
    );

    const formattedAmount = TransformUtils.formattedAmount(transaction.amount);
    const formattedStatus = TransformUtils.formattedStatus(transaction.status);

    return res.render('transaction-accepted', {
      amount: formattedAmount,
      status: formattedStatus,
      buy_order: transaction.buy_order,
      transaction_date: formattedDate,
    });
  }
}
