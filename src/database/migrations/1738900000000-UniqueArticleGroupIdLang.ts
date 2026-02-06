import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueArticleGroupIdLang1738900000000 implements MigrationInterface {
  name = 'UniqueArticleGroupIdLang1738900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_articles_groupId_lang" ON "articles" ("groupId", "lang")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_articles_groupId_lang"`);
  }
}
