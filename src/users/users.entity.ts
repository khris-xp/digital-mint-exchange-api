import * as bcrypt from 'bcrypt';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/enums/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @IsNotEmpty()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @Column({ type: 'float', nullable: true, default: 0.0 })
  token: number;

  @Column({ enum: Role, default: Role.USER })
  roles: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
