import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ArticleLang, ArticlesListResponse } from '../contracts';
import { Article } from '../entities/article.entity';
import { toArticleResponse } from '../utils/article.mapper';
import { decodeCursor, encodeCursor } from '../../../shared/utils';
import { CursorPayload } from 'src/shared/contracts';

@Injectable()
export class ListArticlesUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async run(
    lang: ArticleLang,
    cursor: string | undefined,
    limit: number,
    q: string | undefined,
  ): Promise<ArticlesListResponse> {
    const take = Math.min(limit, 100) + 1;
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .where('a.lang = :lang', { lang })
      .orderBy('a.publishedAt', 'DESC')
      .addOrderBy('a.id', 'DESC')
      .take(take);

    if (q?.trim()) {
      const term = `%${q.trim()}%`;
      qb.andWhere('(a.title LIKE :term OR a.excerpt LIKE :term OR a.content LIKE :term OR a.tags LIKE :termTags)', {
        term,
        termTags: `%${q.trim()}%`,
      });
    }

    if (cursor) {
      const decoded = decodeCursor<CursorPayload>(cursor);
      if (decoded?.id && decoded?.publishedAt) {
        qb.andWhere('(a.publishedAt < :pubAt OR (a.publishedAt = :pubAt AND a.id < :id))', {
          pubAt: decoded.publishedAt,
          id: decoded.id,
        });
      }
    }

    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map(toArticleResponse);

    let nextCursor: string | undefined;
    if (hasMore && rows.length > limit) {
      const lastEntity = rows[limit - 1];
      const pubAt = lastEntity.publishedAt.toISOString();
      nextCursor = encodeCursor({ id: lastEntity.id, publishedAt: pubAt });
    }

    return { items, nextCursor };
  }
}
