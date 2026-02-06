import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import type { SubscriberLang } from '../contracts';

@Entity('subscribers')
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', default: 'es' })
  lang: SubscriberLang;

  @CreateDateColumn()
  createdAt: Date;
}
