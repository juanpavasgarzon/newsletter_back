import { Inject, Injectable } from '@nestjs/common';
import { renderEmailTemplate } from '../../shared/email/email-template.renderer';
import mailConfigLoader from '../../config/mail.config';
import type { MailConfig } from '../mail/contracts';
import { MailService } from '../mail/mail.service';
import type { SubscriberLang } from './contracts';

const WELCOME_SUBJECT: Record<SubscriberLang, string> = {
  es: 'Bienvenido a la newsletter',
  en: 'Welcome to the newsletter',
};

@Injectable()
export class SubscribeMailService {
  constructor(
    @Inject(mailConfigLoader.KEY)
    private readonly mailConfig: MailConfig,
    private readonly mailService: MailService,
  ) {}

  sendWelcome(to: string, lang: SubscriberLang): Promise<void> {
    const from = this.mailConfig.from!;
    const subject = WELCOME_SUBJECT[lang];
    const html = renderEmailTemplate('welcome', lang, {});
    return this.mailService.send({ from, to, subject, html });
  }
}
