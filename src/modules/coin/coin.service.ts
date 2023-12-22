import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { Coin } from './entity/coin.entity';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: Repository<Coin>,
  ) {}

  createCoin(createCoinDto: CreateCoinDto): Promise<Coin> {
    const coin: Coin = new Coin();
    coin.name = createCoinDto.name;
    coin.price = createCoinDto.price;
    coin.image = createCoinDto.image;
    coin.max_supply = createCoinDto.max_supply;
    coin.rate = createCoinDto.rate;
    return this.coinRepository.save(coin);
  }

  findAll(): Promise<Coin[]> {
    return this.coinRepository.find();
  }

  findOne(id: number): Promise<Coin> {
    return this.coinRepository.findOneBy({ id });
  }

  update(id: number, updateCoinDto: UpdateCoinDto): Promise<Coin> {
    const coin: Coin = new Coin();
    coin.name = updateCoinDto.name;
    coin.price = updateCoinDto.price;
    coin.image = updateCoinDto.image;
    coin.max_supply = updateCoinDto.max_supply;
    coin.rate = updateCoinDto.rate;
    coin.id = id;

    return this.coinRepository.save(coin);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.coinRepository.delete(id);
  }
}
