import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { Role } from 'src/enums/roles.enum';
import { RegisterUserDto } from '../users/register-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { getUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invalidate-token')
  async invalidateToken(@Headers('authorization') authorization: string) {
    await this.authService.invalidateToken(authorization);
    return { message: 'Token invalidated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@getUser() user: IUser) {
    return this.usersService.getProfile(user);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
