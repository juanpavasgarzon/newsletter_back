import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readConfigFile } from '../../../config/file-config';
import type { LogoResponse } from '../contracts';
import { logoFileSchema } from '../config.validation';

@Injectable()
export class GetLogoUseCase {
  constructor(private readonly config: ConfigService) {}

  run(): Promise<LogoResponse> {
    const raw = readConfigFile<unknown>('logo.json', this.configDir);
    if (!raw) {
      throw new NotFoundException('Config logo not found');
    }
    const result = logoFileSchema.validate(raw, { stripUnknown: true });
    if (result.error) {
      throw new BadRequestException(`Invalid logo config: ${result.error.message}`);
    }
    return Promise.resolve(result.value as LogoResponse);
  }

  private get configDir(): string {
    return this.config.get<string>('siteFiles.configDir')!;
  }
}
