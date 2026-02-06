import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ArticleResponse, UpdateArticleInput } from '../contracts';
import { Article } from '../entities/article.entity';
import { toArticleResponse } from '../utils/article.mapper';

@Injectable()
export class UpdateArticleUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async run(id: string, dto: UpdateArticleInput): Promise<ArticleResponse> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (dto.slug !== undefined) {
      const existing = await this.articleRepo.findOne({
        where: { slug: dto.slug, lang: article.lang },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`An article with slug "${dto.slug}" already exists for language ${article.lang}`);
      }
      article.slug = dto.slug;
    }
    if (dto.author !== undefined) {
      article.author = dto.author;
    }
    if (dto.tags !== undefined) {
      article.tags = dto.tags;
    }
    if (dto.title !== undefined) {
      article.title = dto.title;
    }
    if (dto.excerpt !== undefined) {
      article.excerpt = dto.excerpt;
    }
    if (dto.content !== undefined) {
      article.content = dto.content;
    }
    if (dto.updatedAt !== undefined) {
      article.updatedAt = new Date(dto.updatedAt);
    } else {
      article.updatedAt = new Date();
    }

    const saved = await this.articleRepo.save(article);
    return toArticleResponse(saved);
  }
}
