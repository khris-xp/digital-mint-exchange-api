import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/users.entity';
import { UsersModule } from '@/modules/users/users.module';
import { UsersService } from '@/modules/users/users.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenIdsStorage } from './refresh-token-id-storage';
import { JwtStrategy } from './startegies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'vcn48GL%b!p+(2dT98mMwtQs6Z6J',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService, RefreshTokenIdsStorage, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
