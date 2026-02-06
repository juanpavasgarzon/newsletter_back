import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738767600000 implements MigrationInterface {
  name = 'InitialSchema1738767600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscribers" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar NOT NULL,
        "createdAt" datetime NOT NULL,
        CONSTRAINT "UQ_subscribers_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "articles" (
        "id" varchar PRIMARY KEY NOT NULL,
        "groupId" varchar NOT NULL,
        "slug" varchar NOT NULL,
        "author" varchar NOT NULL,
        "publishedAt" datetime NOT NULL,
        "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "tags" text NOT NULL,
        "lang" varchar NOT NULL,
        "title" text NOT NULL,
        "excerpt" text NOT NULL,
        "content" text NOT NULL,
        CONSTRAINT "UQ_articles_slug_lang" UNIQUE ("slug", "lang")
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_articles_groupId" ON "articles" ("groupId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_articles_lang" ON "articles" ("lang")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_articles_lang"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_articles_groupId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "articles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscribers"`);
  }
}
