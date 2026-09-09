import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 150,
  })
  title!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    type: 'date',
  })
  date!: string;

  @Column({
    type: 'time',
  })
  time!: string;

  @Column({
    length: 255,
  })
  location!: string;

  @ManyToOne(() => User, (user) => user.events, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}