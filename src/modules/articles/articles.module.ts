import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticlesController } from './articles.controller';
import { ArticleNotifyMailService } from './article-notify-mail.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { ListArticlesUseCase } from './use-cases/list-articles.use-case';
import { GetArticleByIdUseCase } from './use-cases/get-article-by-id.use-case';
import { GetArticleByGroupUseCase } from './use-cases/get-article-by-group.use-case';
import { CreateArticleUseCase } from './use-cases/create-article.use-case';
import { UpdateArticleUseCase } from './use-cases/update-article.use-case';
import { DeleteArticleByIdUseCase } from './use-cases/delete-article-by-id.use-case';
import { DeleteArticleByGroupUseCase } from './use-cases/delete-article-by-group.use-case';
import { ListArticleGroupsUseCase } from './use-cases/list-article-groups.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), MailModule, SubscribeModule, AuthModule],
  controllers: [ArticlesController],
  providers: [
    ArticleNotifyMailService,
    ListArticlesUseCase,
    ListArticleGroupsUseCase,
    GetArticleByIdUseCase,
    GetArticleByGroupUseCase,
    CreateArticleUseCase,
    UpdateArticleUseCase,
    DeleteArticleByIdUseCase,
    DeleteArticleByGroupUseCase,
  ],
})
export class ArticlesModule {}
