import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CoinModule } from './modules/coin/coin.module';
import { Coin } from './modules/coin/entities/coin.entity';
import { CurrencyModule } from './modules/currency/currency.module';
import { User } from './modules/users/entities/users.entity';
import { UsersModule } from './modules/users/users.module';
import { Wallet } from './modules/wallet/entities/wallet.entity';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'khris2547',
      username: 'khrisbharmmano',
      entities: [User, Coin, Wallet],
      database: 'khrisbharmmano',
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CoinModule,
    WalletModule,
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
