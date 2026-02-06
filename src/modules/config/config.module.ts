import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '../subscribe/entities/subscriber.entity';
import { ConfigController } from './config.controller';
import { GetBasicInfoUseCase } from './use-cases/get-basic-info.use-case';
import { GetLogoUseCase } from './use-cases/get-logo.use-case';
import { GetAboutUseCase } from './use-cases/get-about.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [ConfigController],
  providers: [GetBasicInfoUseCase, GetLogoUseCase, GetAboutUseCase],
})
export class ConfigModule {}
