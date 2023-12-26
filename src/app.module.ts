import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [User, Coin, Wallet],
      database: process.env.DB_DATABASE,
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
