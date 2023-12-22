import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  image: string;
  @Column()
  max_supply: number;
  @Column()
  rate: number;
}
