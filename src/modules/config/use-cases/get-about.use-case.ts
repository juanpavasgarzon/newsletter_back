import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readConfigFile } from '../../../config/file-config';
import type { AboutResponse } from '../contracts';
import { aboutFileSchema } from '../config.validation';

@Injectable()
export class GetAboutUseCase {
  constructor(private readonly config: ConfigService) {}

  run(lang?: string): Promise<AboutResponse> {
    const l = this.normalizeLang(lang);
    let raw = readConfigFile<unknown>(`about.${l}.json`, this.configDir);
    if (!raw && l !== 'es') {
      raw = readConfigFile<unknown>('about.es.json', this.configDir);
    }
    if (!raw) {
      throw new NotFoundException(`Config about not found for lang ${l}`);
    }
    const result = aboutFileSchema.validate(raw, { stripUnknown: true });
    if (result.error) {
      throw new BadRequestException(`Invalid about config: ${result.error.message}`);
    }
    return Promise.resolve(result.value as AboutResponse);
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
