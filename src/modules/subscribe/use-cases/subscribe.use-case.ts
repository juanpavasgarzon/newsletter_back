import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeEmail } from '../../../shared/utils';
import type { SubscribeResult, SubscriberLang } from '../contracts';
import { Subscriber } from '../entities/subscriber.entity';
import { SubscribeMailService } from '../subscribe-mail.service';

const SUCCESS_MESSAGE: Record<SubscriberLang, string> = {
  es: 'Te has suscrito correctamente',
  en: 'You have successfully subscribed',
};

@Injectable()
export class SubscribeUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
    private readonly mailService: SubscribeMailService,
  ) {}

  async run(email: string, lang: SubscriberLang): Promise<SubscribeResult> {
    const normalized = normalizeEmail(email);
    const existing = await this.subscriberRepo.findOne({
      where: { email: normalized },
    });
    if (existing) {
      throw new ConflictException('This email is already subscribed');
    }
    await this.subscriberRepo.save(this.subscriberRepo.create({ email: normalized, lang }));
    this.mailService.sendWelcome(normalized, lang).catch(() => {});
    return { ok: true, message: SUCCESS_MESSAGE[lang] };
  }
}
