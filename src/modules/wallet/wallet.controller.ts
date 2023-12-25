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
import { Coin } from '../coin/entity/coin.entity';
import { UsersService } from '../users/users.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
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

    const update_token = user.token - coin.price * createWalletDto.amount;

    await this.updateCoinSupply(
      Number(createWalletDto.coin_id),
      coin.max_supply - createWalletDto.amount,
    );
    await this.updateCoinPrice(Number(createWalletDto.coin_id), update_price);

    await this.updateUserToken('add', user, update_token);

    if (createWalletDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (coin.max_supply - createWalletDto.amount < 0) {
      throw new BadRequestException('Insufficient supply');
    }

    return this.walletService.createWallet(
      owner_id,
      coin.price,
      createWalletDto,
    );
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
  async findByOwner(@Param('owner_id') owner_id: string) {
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(id: string) {
    return this.walletService.remove(+id);
  }
}
