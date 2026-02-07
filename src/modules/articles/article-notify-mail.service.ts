import { Inject, Injectable } from '@nestjs/common';
import { renderEmailTemplate } from '../../shared/email/email-template.renderer';
import mailConfigLoader from '../../config/mail.config';
import type { MailConfig } from '../mail/contracts';
import { MailService } from '../mail/mail.service';
import type { NewArticleEmailPayload } from './contracts';

const NEW_ARTICLE_SUBJECT: Record<string, string> = {
  es: 'Nuevo artículo',
  en: 'New article',
};

@Injectable()
export class ArticleNotifyMailService {
  constructor(
    @Inject(mailConfigLoader.KEY)
    private readonly mailConfig: MailConfig,
    private readonly mailService: MailService,
  ) {}

  sendNewArticle(to: string, lang: string, article: NewArticleEmailPayload): Promise<void> {
    const from = this.mailConfig.from!;
    const frontendUrl = this.mailConfig.frontendUrl!;
    const articleUrl = `${frontendUrl}/${lang}/articles/${article.groupId}`;
    const subject = NEW_ARTICLE_SUBJECT[lang] ?? NEW_ARTICLE_SUBJECT.es;

    const unsubscribeUrl = `${frontendUrl}/${lang}/subscription/unsubscribe?email=${encodeURIComponent(to)}`;
    const html = renderEmailTemplate('new-article', lang, {
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      articleUrl,
      unsubscribeUrl,
    });
    return this.mailService.send({ from, to, subject, html });
  }
}
