import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingBaseEntityToExportTable1747146033442 implements MigrationInterface {
    name = 'AddingBaseEntityToExportTable1747146033442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "exports" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exports" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exports" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exports" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "created_at"`);
    }

}
