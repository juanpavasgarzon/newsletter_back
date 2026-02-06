import { IsString, IsOptional, IsArray, IsIn, IsUUID, MaxLength, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { LANG_VALUES, type ArticleLang } from '../contracts';

export type { ArticleLang };

export class CreateArticleInputDto {
  @IsIn(LANG_VALUES)
  lang: ArticleLang;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  slug?: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;
}

export class UpdateArticleInputDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  slug?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

export class ListArticlesQueryDto {
  @IsIn(LANG_VALUES)
  lang: ArticleLang;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  q?: string;
}
