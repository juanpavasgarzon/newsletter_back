import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SubscribersListResponse } from '../contracts';
import { Subscriber } from '../entities/subscriber.entity';
import { decodeCursor, encodeCursor } from '../../../shared/utils';

@Injectable()
export class ListSubscribersUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async run(cursor: string | undefined, limit: number): Promise<SubscribersListResponse> {
    const take = Math.min(Math.max(limit, 1), 100) + 1;
    const qb = this.subscriberRepo
      .createQueryBuilder('s')
      .orderBy('s.createdAt', 'DESC')
      .addOrderBy('s.id', 'DESC')
      .take(take);

    if (cursor) {
      const decoded = decodeCursor<{ id: string; createdAt: string }>(cursor);
      if (decoded?.id && decoded?.createdAt) {
        qb.andWhere('(s.createdAt < :createdAt OR (s.createdAt = :createdAt AND s.id < :id))', {
          createdAt: decoded.createdAt,
          id: decoded.id,
        });
      }
    }

    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map((s) => ({
      id: s.id,
      email: s.email,
      lang: s.lang,
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
    }));

    let nextCursor: string | undefined;
    if (hasMore && rows.length > limit) {
      const last = rows[limit - 1];
      nextCursor = encodeCursor({
        id: last.id,
        createdAt: last.createdAt instanceof Date ? last.createdAt.toISOString() : String(last.createdAt),
      });
    }

    return { items, nextCursor };
  }
}
