import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decodeCursor, encodeCursor } from '../../../shared/utils';
import type { ArticleGroupSummary, ArticleGroupsListResponse, ArticleLang } from '../contracts';
import { LANG_VALUES } from '../contracts';
import { Article } from '../entities/article.entity';

@Injectable()
export class ListArticleGroupsUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async run(cursor: string | undefined, limit: number, q: string | undefined): Promise<ArticleGroupsListResponse> {
    const limitNum = Math.min(Math.max(1, limit), 100);

    let qb = this.articleRepo
      .createQueryBuilder('a')
      .select('a.groupId', 'groupId')
      .addSelect('a.lang', 'lang')
      .addSelect('a.title', 'title')
      .addSelect('a.excerpt', 'excerpt')
      .addSelect('a.publishedAt', 'publishedAt')
      .orderBy('a.groupId', 'ASC')
      .addOrderBy('a.publishedAt', 'DESC');

    if (q?.trim()) {
      const term = `%${q.trim()}%`;
      qb = qb.andWhere(
        '(a.title ILIKE :term OR a.excerpt ILIKE :term OR a.content ILIKE :term OR a.tags ILIKE :term)',
        { term },
      );
    }

    if (cursor) {
      const decoded = decodeCursor<{ groupId: string }>(cursor);
      if (decoded?.groupId) {
        qb = qb.andWhere('a.groupId > :groupId', {
          groupId: decoded.groupId,
        });
      }
    }

    const rows = await qb.getRawMany<{
      groupId: string;
      lang: string;
      title: string;
      excerpt: string;
      publishedAt: Date;
    }>();

    const byGroup = new Map<
      string,
      { support: ArticleLang[]; title: string; excerpt: string; dateSum: number; dateCount: number }
    >();

    for (const row of rows) {
      const lang = row.lang as ArticleLang;

      if (!LANG_VALUES.includes(lang)) {
        continue;
      }

      const existing = byGroup.get(row.groupId);
      const publishedAt = row.publishedAt instanceof Date ? row.publishedAt : new Date(row.publishedAt as string);
      const ts = publishedAt.getTime();

      if (existing === undefined) {
        byGroup.set(row.groupId, {
          support: [lang],
          title: row.title,
          excerpt: row.excerpt,
          dateSum: ts,
          dateCount: 1,
        });
      } else {
        if (existing.support.includes(lang) === false) {
          existing.support.push(lang);
        }
        existing.dateSum += ts;
        existing.dateCount += 1;
      }
    }

    const allGroups: ArticleGroupSummary[] = Array.from(byGroup.entries())
      .map(([groupId, acc]) => ({
        groupId,
        support: ([...new Set(acc.support)] as ArticleLang[]).sort(),
        title: acc.title,
        excerpt: acc.excerpt,
        publishedAt: new Date(acc.dateSum / acc.dateCount).toISOString(),
      }))
      .sort((a, b) => a.groupId.localeCompare(b.groupId));

    const hasMore = allGroups.length > limitNum;
    const items = allGroups.slice(0, limitNum);

    let nextCursor: string | undefined = undefined;
    if (hasMore && items.length) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor({ groupId: lastItem.groupId });
    }

    return { items, nextCursor };
  }
}
