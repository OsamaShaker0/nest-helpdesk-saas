import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUsersTable1794239842275 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "user"
    RENAME TO "users"
  `);

  await queryRunner.query(`
    ALTER TYPE "public"."user_status_enum"
    RENAME TO "users_status_enum"
  `);

  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "createdAt"
    TYPE TIMESTAMP WITH TIME ZONE
    USING "createdAt" AT TIME ZONE 'Asia/Amman'
  `);

  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "updatedAt"
    TYPE TIMESTAMP WITH TIME ZONE
    USING "updatedAt" AT TIME ZONE 'Asia/Amman'
  `);
}

    public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "createdAt"
    TYPE TIMESTAMP WITHOUT TIME ZONE
    USING "createdAt" AT TIME ZONE 'Asia/Amman'
  `);

  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "updatedAt"
    TYPE TIMESTAMP WITHOUT TIME ZONE
    USING "updatedAt" AT TIME ZONE 'Asia/Amman'
  `);

  await queryRunner.query(`
    ALTER TYPE "public"."users_status_enum"
    RENAME TO "user_status_enum"
  `);

  await queryRunner.query(`
    ALTER TABLE "users"
    RENAME TO "user"
  `);
}

}
