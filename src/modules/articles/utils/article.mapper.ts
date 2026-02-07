import { toISOString } from '../../../shared/utils/date.util';
import type { ArticleResponse } from '../contracts';
import type { Article } from '../entities/article.entity';

export function toArticleResponse(article: Article): ArticleResponse {
  return {
    id: article.id,
    groupId: article.groupId,
    slug: article.slug,
    author: article.author,
    publishedAt: toISOString(article.publishedAt),
    updatedAt: toISOString(article.updatedAt),
    tags: Array.isArray(article.tags) ? article.tags : [],
    lang: article.lang,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
  };
}
