import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { Coin } from './entity/coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coin])],
  providers: [CoinService],
  controllers: [CoinController],
})
export class CoinModule {}
