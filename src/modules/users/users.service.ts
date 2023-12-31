import { IUser } from '@/shared/interface/user.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(signUpDto: SignUpDto): Promise<User> {
    const { username, email, password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async getProfile(user: IUser): Promise<IUser> {
    return user;
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async addToken(token: number, user: IUser): Promise<IUser> {
    if (token <= 0) {
      throw new BadRequestException('Token must be greater than 0');
    }
    user.token += token;
    return this.userRepository.save(user);
  }

  async updateToken(token: number, user: IUser): Promise<IUser> {
    if (token <= 0) {
      throw new BadRequestException('Token must be greater than 0');
    }
    user.token = token;
    return this.userRepository.save(user);
  }
}
