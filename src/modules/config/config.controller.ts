import { Controller, Get, Query } from '@nestjs/common';
import type { BasicInfo, LogoResponse, AboutResponse } from './contracts';
import { GetBasicInfoUseCase } from './use-cases/get-basic-info.use-case';
import { GetLogoUseCase } from './use-cases/get-logo.use-case';
import { GetAboutUseCase } from './use-cases/get-about.use-case';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly getBasicInfoUseCase: GetBasicInfoUseCase,
    private readonly getLogoUseCase: GetLogoUseCase,
    private readonly getAboutUseCase: GetAboutUseCase,
  ) {}

  @Get('basic-info')
  getBasicInfo(@Query('lang') lang?: string): Promise<BasicInfo> {
    return this.getBasicInfoUseCase.run(lang);
  }

  @Get('logo')
  getLogo(): Promise<LogoResponse> {
    return this.getLogoUseCase.run();
  }

  @Get('about')
  getAbout(@Query('lang') lang?: string): Promise<AboutResponse> {
    return this.getAboutUseCase.run(lang);
  }
}
