import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribeController } from './subscribe.controller';
import { SubscribeMailService } from './subscribe-mail.service';
import { SubscribeNotifyService } from './subscribe-notify.service';
import { SubscribeUseCase } from './use-cases/subscribe.use-case';
import { GetAllEmailsUseCase } from './use-cases/get-all-emails.use-case';
import { GetSubscriberCountUseCase } from './use-cases/get-subscriber-count.use-case';
import { ListSubscribersUseCase } from './use-cases/list-subscribers.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber]), MailModule],
  controllers: [SubscribeController],
  providers: [
    SubscribeMailService,
    SubscribeNotifyService,
    SubscribeUseCase,
    GetAllEmailsUseCase,
    GetSubscriberCountUseCase,
    ListSubscribersUseCase,
  ],
  exports: [SubscribeNotifyService],
})
export class SubscribeModule {}
