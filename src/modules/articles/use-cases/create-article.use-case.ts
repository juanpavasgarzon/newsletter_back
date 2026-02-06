import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { slugify } from '../../../shared/utils';
import { SubscribeNotifyService } from '../../subscribe/subscribe-notify.service';
import { ArticleNotifyMailService } from '../article-notify-mail.service';
import type { ArticleResponse, CreateArticleInput } from '../contracts';
import { Article } from '../entities/article.entity';
import { toArticleResponse } from '../utils/article.mapper';

@Injectable()
export class CreateArticleUseCase {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    private readonly subscribeNotify: SubscribeNotifyService,
    private readonly articleNotifyMail: ArticleNotifyMailService,
  ) {}

  async run(dto: CreateArticleInput): Promise<ArticleResponse> {
    const lang = dto.lang;
    const groupId = dto.groupId ?? randomUUID();

    if (dto.groupId) {
      const groupExists = await this.articleRepo.findOne({ where: { groupId: dto.groupId } });
      if (!groupExists) {
        throw new BadRequestException('groupId does not exist');
      }
    }

    const duplicateGroupLang = await this.articleRepo.findOne({ where: { groupId, lang } });
    if (duplicateGroupLang) {
      throw new ConflictException(`An article already exists for this group and language (${lang})`);
    }

    let slug = dto.slug?.trim();
    if (!slug) {
      slug = slugify(dto.title);
    }
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    const existingSlug = await this.articleRepo.findOne({
      where: { slug, lang },
    });
    if (existingSlug) {
      throw new ConflictException(`An article with slug "${slug}" already exists for language ${lang}`);
    }

    const article = this.articleRepo.create({
      groupId,
      slug,
      author: dto.author,
      tags: dto.tags ?? [],
      lang,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
    });
    const saved = await this.articleRepo.save(article);

    const isFirstArticleOfGroup = dto.groupId === undefined;
    if (isFirstArticleOfGroup) {
      const payload = {
        groupId: saved.groupId,
        title: saved.title,
        excerpt: saved.excerpt,
        author: saved.author,
        lang: saved.lang,
      };
      const subscribers = await this.subscribeNotify.getSubscribersForNotificationByLang(saved.lang);
      const sendPromises = subscribers.map((sub) =>
        this.articleNotifyMail.sendNewArticle(sub.email, sub.lang, payload),
      );
      const results = await Promise.allSettled(sendPromises);
      for (const result of results) {
        if (result.status === 'rejected') {
          console.error(result.reason);
        }
      }
    }

    return toArticleResponse(saved);
  }
}
