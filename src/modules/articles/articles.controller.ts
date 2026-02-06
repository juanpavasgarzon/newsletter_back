import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  LANG_VALUES,
  type ArticleGroupsListResponse,
  type ArticleLang,
  type ArticleResponse,
  type ArticlesListResponse,
} from './contracts';
import { CreateArticleInputDto, UpdateArticleInputDto } from './dto/article.dto';
import { CreateArticleUseCase } from './use-cases/create-article.use-case';
import { DeleteArticleByGroupUseCase } from './use-cases/delete-article-by-group.use-case';
import { DeleteArticleByIdUseCase } from './use-cases/delete-article-by-id.use-case';
import { GetArticleByGroupUseCase } from './use-cases/get-article-by-group.use-case';
import { GetArticleByIdUseCase } from './use-cases/get-article-by-id.use-case';
import { ListArticleGroupsUseCase } from './use-cases/list-article-groups.use-case';
import { ListArticlesUseCase } from './use-cases/list-articles.use-case';
import { UpdateArticleUseCase } from './use-cases/update-article.use-case';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(
    private readonly listArticles: ListArticlesUseCase,
    private readonly listArticleGroups: ListArticleGroupsUseCase,
    private readonly getArticleById: GetArticleByIdUseCase,
    private readonly getArticleByGroup: GetArticleByGroupUseCase,
    private readonly createArticle: CreateArticleUseCase,
    private readonly updateArticle: UpdateArticleUseCase,
    private readonly deleteArticleById: DeleteArticleByIdUseCase,
    private readonly deleteArticleByGroup: DeleteArticleByGroupUseCase,
  ) {}

  @Get()
  @Public()
  async list(
    @Query('lang') lang: ArticleLang,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
  ): Promise<ArticlesListResponse> {
    const limitNum = limit != null ? Number(limit) : 10;
    if (!lang || !LANG_VALUES.includes(lang)) {
      throw new BadRequestException('lang is required and must be es or en');
    }
    return this.listArticles.run(lang, cursor, limitNum, q);
  }

  @Get('groups')
  async listGroups(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
  ): Promise<ArticleGroupsListResponse> {
    const limitNum = limit != null ? Number(limit) : 10;
    return this.listArticleGroups.run(cursor, limitNum, q);
  }

  @Get('by-group')
  @Public()
  async listByGroup(
    @Query('lang') lang: ArticleLang,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<ArticlesListResponse> {
    const limitNum = limit != null ? Number(limit) : 10;
    if (!lang || !LANG_VALUES.includes(lang)) {
      throw new BadRequestException('lang is required and must be es or en');
    }
    return this.listArticles.run(lang, cursor, limitNum, undefined);
  }

  @Get('by-group/:groupId')
  @Public()
  async getByGroupId(@Param('groupId') groupId: string, @Query('lang') lang: ArticleLang): Promise<ArticleResponse> {
    if (!lang || !LANG_VALUES.includes(lang)) {
      throw new BadRequestException('lang is required and must be es or en');
    }
    return this.getArticleByGroup.run(groupId, lang);
  }

  @Get(':id')
  @Public()
  async getById(@Param('id') id: string): Promise<ArticleResponse> {
    return this.getArticleById.run(id);
  }

  @Post()
  async create(@Body() body: CreateArticleInputDto): Promise<ArticleResponse> {
    return this.createArticle.run(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateArticleInputDto): Promise<ArticleResponse> {
    return this.updateArticle.run(id, body);
  }

  @Delete('group/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByGroupId(@Param('groupId') groupId: string): Promise<void> {
    return this.deleteArticleByGroup.run(groupId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    return this.deleteArticleById.run(id);
  }
}
