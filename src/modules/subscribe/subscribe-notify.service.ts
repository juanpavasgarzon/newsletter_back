import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SubscriberLang } from './contracts';
import { Subscriber } from './entities/subscriber.entity';

@Injectable()
export class SubscribeNotifyService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async getSubscribersForNotificationByLang(lang: SubscriberLang): Promise<{ email: string; lang: string }[]> {
    const list = await this.subscriberRepo.find({
      select: ['email', 'lang'],
      where: { lang },
      order: { createdAt: 'ASC' },
    });
    return list.map((s) => ({ email: s.email, lang: s.lang }));
  }
}
