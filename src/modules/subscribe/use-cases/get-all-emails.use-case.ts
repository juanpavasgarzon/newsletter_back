import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../entities/subscriber.entity';

@Injectable()
export class GetAllEmailsUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async run(): Promise<string[]> {
    const list = await this.subscriberRepo.find({
      select: ['email'],
      order: { createdAt: 'ASC' },
    });
    return list.map((s) => s.email);
  }
}
