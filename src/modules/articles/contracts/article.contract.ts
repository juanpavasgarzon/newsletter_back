export const LANG_VALUES = ['es', 'en'] as const;
export type ArticleLang = (typeof LANG_VALUES)[number];

export interface CreateArticleInput {
  lang: ArticleLang;
  groupId?: string;
  slug?: string;
  author: string;
  tags?: string[];
  title: string;
  excerpt: string;
  content: string;
}

export interface UpdateArticleInput {
  slug?: string;
  author?: string;
  tags?: string[];
  title?: string;
  excerpt?: string;
  content?: string;
  updatedAt?: string;
}

export interface ArticleResponse {
  id: string;
  groupId: string;
  slug: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  lang: ArticleLang;
  title: string;
  excerpt: string;
  content: string;
}

export interface ArticlesListResponse {
  items: ArticleResponse[];
  nextCursor?: string;
}

export interface ArticleGroupSummary {
  groupId: string;
  support: ArticleLang[];
  title: string;
  excerpt: string;
  publishedAt: string;
}

export interface ArticleGroupsListResponse {
  items: ArticleGroupSummary[];
  nextCursor?: string;
}

export interface NewArticleEmailPayload {
  groupId: string;
  title: string;
  excerpt: string;
  author: string;
  lang: string;
}
