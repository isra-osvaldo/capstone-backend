import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigService } from './keycloak/keycloak.service';
import { KeyCloakConfigModule } from './keycloak/keycloak.module';
import configuration from './config/configuration';
import { GlobalKeyCloakGuard } from './keycloak/keycloak.guard';
import { ProductModule } from './product/product.module';
import { PublishModule } from './publish/publish.module';
import { AWSModule } from './aws/aws.module';
import { ReputationModule } from './reputation/reputation.module';
import { ExchangeModule } from './exchange/exchange.module';
import { FavoriteModule } from './favorite/favorite.module';
import { TransbankModule } from './transbank/transbank.module';
import { PlanModule } from './plan/plan.module';
import { MailModule } from './mail/mail.module';
import { CalificationModule } from './calification/calification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeyCloakConfigModule],
    }),
    ProductModule,
    PublishModule,
    AWSModule,
    ReputationModule,
    ExchangeModule,
    FavoriteModule,
    TransbankModule,
    PlanModule,
    MailModule,
    CalificationModule,
  ],
  providers: [...GlobalKeyCloakGuard],
})
export class AppModule {}
