import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'float', nullable: true })
  price: number;
  @Column()
  image: string;
  @Column({ type: 'float', nullable: true })
  max_supply: number;
  @Column({ type: 'float', nullable: true })
  rate: number;
}
