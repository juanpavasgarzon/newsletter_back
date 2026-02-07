import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import type { ArticleLang } from '../contracts';

@Entity('articles')
@Index(['slug', 'lang'], { unique: true })
@Index(['groupId', 'lang'], { unique: true })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  groupId: string;

  @Column()
  slug: string;

  @Column()
  author: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({
    type: 'text',
    transformer: {
      to: (v: string[]) => JSON.stringify(v ?? []),
      from: (v: string): string[] => (v ? (JSON.parse(v) as string[]) : []),
    },
  })
  tags: string[];

  @Column({ type: 'text' })
  @Index()
  lang: ArticleLang;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;
}
