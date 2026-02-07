import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeEmail } from '../../../shared/utils';
import type { UnsubscribeResult } from '../contracts';
import { Subscriber } from '../entities/subscriber.entity';

@Injectable()
export class UnsubscribeUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async run(email: string): Promise<UnsubscribeResult> {
    const normalized = normalizeEmail(email);
    const existing = await this.subscriberRepo.findOne({
      where: { email: normalized },
    });
    if (existing) {
      await this.subscriberRepo.remove(existing);
    }
    return { ok: true };
  }
}
