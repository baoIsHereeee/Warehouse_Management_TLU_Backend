import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingTenantIdToRole1748511204072 implements MigrationInterface {
    name = 'AddingTenantIdToRole1748511204072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "tenant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "age" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "age" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "tenant_id"`);
    }

}
