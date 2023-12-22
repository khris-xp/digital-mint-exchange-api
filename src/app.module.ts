import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CoinModule } from './modules/coin/coin.module';
import { Coin } from './modules/coin/entity/coin.entity';
import { User } from './modules/users/users.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'khris2547',
      username: 'khrisbharmmano',
      entities: [User, Coin],
      database: 'khrisbharmmano',
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CoinModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
