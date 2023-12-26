import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
