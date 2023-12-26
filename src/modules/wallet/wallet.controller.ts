import { getUser } from '@/common/decorators/get-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/shared/enums/roles.enum';
import { IUser } from '@/shared/interface/user.interface';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CoinService } from '../coin/coin.service';
import { Coin } from '../coin/entities/coin.entity';
import { UsersService } from '../users/users.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { SellWalletDto } from './dto/sell-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
    private readonly coinService: CoinService,
  ) {}

  private async getOwnerId(user: IUser): Promise<string> {
    const user_data = await this.usersService.getProfile(user);
    return String(user_data.id);
  }

  private async updateUserToken(
    type: string,
    user: IUser,
    token: number,
  ): Promise<IUser> {
    if (token <= 0) {
      throw new BadRequestException('Token must be greater than 0');
    }
    if (type === 'add') {
      user.token -= token;
    } else if (type === 'remove') {
      user.token += token;
    }
    return this.usersService.updateToken(token, user);
  }

  private async getCoin(coinId: number) {
    return this.coinService.findOne(coinId);
  }

  private calculateUpdatePrice(coin: Coin, amount: number): number {
    return 1000000 * (coin.rate / (coin.max_supply - amount));
  }

  private updateCoinSupply(coinId: number, newSupply: number) {
    return this.coinService.updateSupply(coinId, newSupply);
  }

  private updateCoinPrice(coinId: number, newPrice: number) {
    return this.coinService.updatePrice(coinId, newPrice);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWallet(
    @getUser() user: IUser,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    const owner_id = await this.getOwnerId(user);
    const coin = await this.getCoin(Number(createWalletDto.coin_id));
    const update_price = this.calculateUpdatePrice(
      coin,
      createWalletDto.amount,
    );

    if (createWalletDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (user.token < coin.price * createWalletDto.amount) {
      throw new BadRequestException('Insufficient token');
    }

    if (coin.max_supply - createWalletDto.amount < 0) {
      throw new BadRequestException('Insufficient supply');
    }

    const update_token = user.token - coin.price * createWalletDto.amount;

    await this.updateCoinSupply(
      Number(createWalletDto.coin_id),
      coin.max_supply - createWalletDto.amount,
    );
    await this.updateCoinPrice(Number(createWalletDto.coin_id), update_price);

    await this.updateUserToken('add', user, update_token);

    return this.walletService.createWallet(
      owner_id,
      coin.price,
      createWalletDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transferWallet(
    @getUser() user: IUser,
    @Body() transferWalletDto: TransferWalletDto,
  ) {
    const owner_id = await this.getOwnerId(user);
    const coin = await this.getCoin(Number(transferWalletDto.coin_id));
    const userWallet = await this.walletService.findByOwner(owner_id);
    const coinInWallet = userWallet.find(
      (walletEntry) => walletEntry.coin_id === String(coin.id),
    );
    if (owner_id === transferWalletDto.transfer_id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    if (transferWalletDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (!coinInWallet) {
      throw new BadRequestException('Coin not found');
    }

    return this.walletService.transferWallet(
      owner_id,
      coin.price,
      transferWalletDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('sell')
  async sellWallet(
    @getUser() user: IUser,
    @Body() sellWalletDto: SellWalletDto,
  ) {
    const owner_id = await this.getOwnerId(user);
    const coin = await this.getCoin(Number(sellWalletDto.coin_id));
    const update_price = this.calculateUpdatePrice(coin, sellWalletDto.amount);

    if (sellWalletDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (sellWalletDto.amount > coin.max_supply) {
      throw new BadRequestException('Not enough amount');
    }

    const update_token = user.token + coin.price * sellWalletDto.amount;

    await this.updateCoinSupply(
      Number(sellWalletDto.coin_id),
      coin.max_supply + sellWalletDto.amount,
    );

    await this.updateCoinPrice(Number(sellWalletDto.coin_id), update_price);

    await this.updateUserToken('remove', user, update_token);

    return this.walletService.sellWallet(owner_id, coin.price, sellWalletDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return this.walletService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('owner/:owner_id')
  async findByOwner(
    @getUser() user: IUser,
    @Param('owner_id') owner_id: string,
  ) {
    const user_id = await this.getOwnerId(user);
    if (user_id !== owner_id) {
      throw new BadRequestException('Cannot view other user wallet');
    }
    return this.walletService.findByOwner(owner_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @getUser() user: IUser,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    const user_data = this.usersService.getProfile(user);
    const owner_id = String((await user_data).id);
    const coin = await this.getCoin(Number(updateWalletDto.coin_id));
    return this.walletService.update(
      +id,
      owner_id,
      coin.price,
      updateWalletDto,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(id: string) {
    return this.walletService.remove(+id);
  }
}
