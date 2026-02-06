import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readConfigFile } from '../../../config/file-config';
import type { BasicInfo } from '../contracts';
import { Subscriber } from '../../subscribe/entities/subscriber.entity';
import { basicInfoFileSchema } from '../config.validation';

@Injectable()
export class GetBasicInfoUseCase {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
    private readonly config: ConfigService,
  ) {}

  async run(lang?: string): Promise<BasicInfo> {
    const l = this.normalizeLang(lang);
    let raw = readConfigFile<unknown>(`basic-info.${l}.json`, this.configDir);
    if (!raw && l !== 'es') {
      raw = readConfigFile<unknown>('basic-info.es.json', this.configDir);
    }
    if (!raw) {
      throw new NotFoundException(`Config basic-info not found for lang ${l}`);
    }
    const result = basicInfoFileSchema.validate(raw, { stripUnknown: true });
    if (result.error) {
      throw new BadRequestException(`Invalid basic-info config: ${result.error.message}`);
    }
    const count = await this.subscriberRepo.count();
    const basic = result.value as Omit<BasicInfo, 'subscriberCount'>;
    return { ...basic, subscriberCount: count };
  }

  private get configDir(): string {
    return this.config.get<string>('siteFiles.configDir')!;
  }

  private normalizeLang(lang?: string): string {
    if (lang === 'en') {
      return 'en';
    }
    return 'es';
  }
}
