import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetArticlesPublishedAtDefault1739000001000 implements MigrationInterface {
  name = 'SetArticlesPublishedAtDefault1739000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "publishedAt" SET DEFAULT CURRENT_TIMESTAMP`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "publishedAt" DROP DEFAULT`);
  }
}
