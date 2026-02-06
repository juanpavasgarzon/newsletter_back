import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configLoaders, envValidationSchema } from './config';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { MailModule } from './modules/mail/mail.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: configLoaders,
      validationSchema: envValidationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    DatabaseModule,
    AuthModule,
    MailModule,
    ArticlesModule,
    SubscribeModule,
    ConfigModule,
  ],
})
export class AppModule {}
