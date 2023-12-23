import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  owner_id: string;
  @Column()
  coin_id: string;
  @Column()
  amount: number;
  @Column()
  price: number;
  @Column()
  total: number;
}
