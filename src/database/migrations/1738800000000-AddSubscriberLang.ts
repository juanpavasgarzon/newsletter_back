import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubscriberLang1738800000000 implements MigrationInterface {
  name = 'AddSubscriberLang1738800000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "subscribers" ADD COLUMN "lang" text NOT NULL DEFAULT 'es'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN "lang"`);
  }
}
