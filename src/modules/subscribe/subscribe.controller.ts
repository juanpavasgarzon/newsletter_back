import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SubscribeUseCase } from './use-cases/subscribe.use-case';
import { UnsubscribeUseCase } from './use-cases/unsubscribe.use-case';
import { GetAllEmailsUseCase } from './use-cases/get-all-emails.use-case';
import { GetSubscriberCountUseCase } from './use-cases/get-subscriber-count.use-case';
import { ListSubscribersUseCase } from './use-cases/list-subscribers.use-case';
import {
  SubscribeInputDto,
  UnsubscribeInputDto,
  UnsubscribeQueryDto,
} from './dto/subscribe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import type {
  SubscriberCountResponse,
  SubscribersListResponse,
  UnsubscribeResult,
} from './contracts';

@Controller('subscribe')
@UseGuards(JwtAuthGuard)
export class SubscribeController {
  constructor(
    private readonly subscribeUseCase: SubscribeUseCase,
    private readonly unsubscribeUseCase: UnsubscribeUseCase,
    private readonly getAllEmailsUseCase: GetAllEmailsUseCase,
    private readonly getSubscriberCountUseCase: GetSubscriberCountUseCase,
    private readonly listSubscribersUseCase: ListSubscribersUseCase,
  ) {}

  @Post()
  @Public()
  subscribe(@Body() body: SubscribeInputDto) {
    return this.subscribeUseCase.run(body.email, body.lang ?? 'es');
  }

  @Get('count')
  async getCount(): Promise<SubscriberCountResponse> {
    return this.getSubscriberCountUseCase.run();
  }

  @Get()
  async listSubscribers(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ): Promise<SubscribersListResponse> {
    const parsedLimit = limit ? Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100) : 20;
    return this.listSubscribersUseCase.run(cursor, parsedLimit);
  }

  @Get('emails')
  async getEmails(): Promise<{ emails: string[] }> {
    const emails = await this.getAllEmailsUseCase.run();
    return { emails };
  }

  @Post('unsubscribe')
  @Public()
  unsubscribe(@Body() body: UnsubscribeInputDto): Promise<UnsubscribeResult> {
    return this.unsubscribeUseCase.run(body.email);
  }

  @Get('unsubscribe')
  @Public()
  unsubscribeByQuery(
    @Query() query: UnsubscribeQueryDto,
  ): Promise<UnsubscribeResult> {
    return this.unsubscribeUseCase.run(query.email);
  }
}
