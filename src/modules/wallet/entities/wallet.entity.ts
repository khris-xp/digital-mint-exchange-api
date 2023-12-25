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
  @Column({ type: 'float', nullable: true })
  price: number;
  @Column({ type: 'float', nullable: true })
  total: number;
}
