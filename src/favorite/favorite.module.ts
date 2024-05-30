import { Module } from '@nestjs/common';
import { MongoModule } from 'src/db/mongo.module';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';

const providers = [FavoriteService];

@Module({
  imports: [MongoModule],
  controllers: [FavoriteController],
  providers: [...providers],
  exports: [...providers],
})
export class FavoriteModule {}
