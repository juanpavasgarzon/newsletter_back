import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ArticleLang, ArticleResponse } from '../contracts';
import { Article } from '../entities/article.entity';
import { toArticleResponse } from '../utils/article.mapper';

@Injectable()
export class GetArticleByGroupUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async run(groupId: string, lang: ArticleLang): Promise<ArticleResponse> {
    const article = await this.articleRepo.findOne({
      where: { groupId, lang },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return toArticleResponse(article);
  }
}
