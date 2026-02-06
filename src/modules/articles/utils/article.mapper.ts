import type { ArticleResponse } from '../contracts';
import type { Article } from '../entities/article.entity';

export function toArticleResponse(article: Article): ArticleResponse {
  return {
    id: article.id,
    groupId: article.groupId,
    slug: article.slug,
    author: article.author,
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt instanceof Date ? article.updatedAt.toISOString() : String(article.updatedAt),
    tags: Array.isArray(article.tags) ? article.tags : [],
    lang: article.lang,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
  };
}
