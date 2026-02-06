import { IsEmail, IsIn, IsOptional } from 'class-validator';
import { SUBSCRIBER_LANGS } from '../contracts';

export class SubscribeInputDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(SUBSCRIBER_LANGS)
  lang?: (typeof SUBSCRIBER_LANGS)[number];
}
