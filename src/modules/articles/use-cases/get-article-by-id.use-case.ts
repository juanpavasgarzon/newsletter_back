import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ArticleResponse } from '../contracts';
import { Article } from '../entities/article.entity';
import { toArticleResponse } from '../utils/article.mapper';

@Injectable()
export class GetArticleByIdUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async run(id: string): Promise<ArticleResponse> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return toArticleResponse(article);
  }
}
