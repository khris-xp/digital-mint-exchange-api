import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(
    owner_id: string,
    price: number,
    wallet: CreateWalletDto,
  ): Promise<Wallet> {
    if (wallet.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const existingWallet = await this.walletRepository.findOne({
      where: { owner_id, coin_id: wallet.coin_id },
    });

    if (existingWallet) {
      existingWallet.amount += wallet.amount;
      existingWallet.price = price;
      existingWallet.total = price * existingWallet.amount;

      return this.walletRepository.save(existingWallet);
    } else {
      const newWallet: Wallet = new Wallet();
      newWallet.owner_id = owner_id;
      newWallet.coin_id = wallet.coin_id;
      newWallet.amount = wallet.amount;
      newWallet.price = price;
      newWallet.total = price * wallet.amount;

      return this.walletRepository.save(newWallet);
    }
  }

  async sellWallet(
    owner_id: string,
    price: number,
    wallet: CreateWalletDto,
  ): Promise<Wallet> {
    if (wallet.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const existingWallet = await this.walletRepository.findOne({
      where: { owner_id, coin_id: wallet.coin_id },
    });

    if (existingWallet) {
      if (existingWallet.amount < wallet.amount) {
        throw new BadRequestException('Not enough amount');
      }
      existingWallet.amount -= wallet.amount;
      existingWallet.price = price;
      existingWallet.total = price * existingWallet.amount;

      return this.walletRepository.save(existingWallet);
    } else {
      throw new BadRequestException('Wallet not found');
    }
  }

  findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  findOne(id: number): Promise<Wallet> {
    return this.walletRepository.findOneBy({ id });
  }

  findByOwner(owner_id: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { owner_id },
    });
  }

  update(
    id: number,
    owner_id: string,
    price: number,
    wallet: UpdateWalletDto,
  ): Promise<Wallet> {
    const newWallet: Wallet = new Wallet();
    newWallet.owner_id = owner_id;
    newWallet.coin_id = wallet.coin_id;
    newWallet.amount = wallet.amount;
    newWallet.price = price;
    newWallet.total = price * wallet.amount;
    newWallet.id = id;

    return this.walletRepository.save(newWallet);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.walletRepository.delete(id);
  }
}
