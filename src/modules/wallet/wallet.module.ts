import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinService } from '../coin/coin.service';
import { Coin } from '../coin/entities/coin.entity';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { Wallet } from './entities/wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User, Coin])],
  providers: [WalletService, UsersService, CoinService],
  controllers: [WalletController],
})
export class WalletModule {}
