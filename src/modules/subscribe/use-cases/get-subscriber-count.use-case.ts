import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SubscriberCountResponse } from '../contracts';
import { Subscriber } from '../entities/subscriber.entity';

@Injectable()
export class GetSubscriberCountUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async run(): Promise<SubscriberCountResponse> {
    const count = await this.subscriberRepo.count();
    return { count };
  }
}
