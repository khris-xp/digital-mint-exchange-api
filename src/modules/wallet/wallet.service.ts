import { Injectable } from '@nestjs/common';
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

  createWallet(owner_id: string, wallet: CreateWalletDto): Promise<Wallet> {
    const newWallet: Wallet = new Wallet();
    newWallet.owner_id = owner_id;
    newWallet.coin_id = wallet.coin_id;
    newWallet.amount = wallet.amount;
    newWallet.price = wallet.price;
    newWallet.total = wallet.total;
    return this.walletRepository.save(newWallet);
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
    wallet: UpdateWalletDto,
  ): Promise<Wallet> {
    const newWallet: Wallet = new Wallet();
    newWallet.owner_id = owner_id;
    newWallet.coin_id = wallet.coin_id;
    newWallet.amount = wallet.amount;
    newWallet.price = wallet.price;
    newWallet.total = wallet.total;
    newWallet.id = id;

    return this.walletRepository.save(newWallet);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.walletRepository.delete(id);
  }
}
