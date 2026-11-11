import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMembershipsTable1794319759049 implements MigrationInterface {
    name = 'CreateMembershipsTable1794319759049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."memberships_role_enum" AS ENUM('COMPANY_ADMIN', 'SUPPORT_AGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."memberships_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED')`);
        await queryRunner.query(`CREATE TABLE "memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "role" "public"."memberships_role_enum" NOT NULL, "status" "public"."memberships_status_enum" NOT NULL DEFAULT 'ACTIVE', "tenantId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_memberships_user_tenant" UNIQUE ("userId", "tenantId"), CONSTRAINT "PK_25d28bd932097a9e90495ede7b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3eed8323a0d00041f74753d411" ON "memberships"  ("tenantId") `);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_187d573e43b2c2aa3960df20b78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_3eed8323a0d00041f74753d4116" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_3eed8323a0d00041f74753d4116"`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_187d573e43b2c2aa3960df20b78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3eed8323a0d00041f74753d411"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
        await queryRunner.query(`DROP TYPE "public"."memberships_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."memberships_role_enum"`);
    }

}
