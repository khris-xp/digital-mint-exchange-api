import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/shared/enums/roles.enum';
import { IUser } from 'src/shared/interface/user.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWallet(
    @getUser() user: IUser,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    const user_data = this.usersService.getProfile(user);
    const owner_id = String((await user_data).id);
    return this.walletService.createWallet(owner_id, createWalletDto);
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
    @Body() updateWalletDto: CreateWalletDto,
  ) {
    const user_data = this.usersService.getProfile(user);
    const owner_id = String((await user_data).id);
    return this.walletService.update(+id, owner_id, updateWalletDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(id: string) {
    return this.walletService.remove(+id);
  }
}
