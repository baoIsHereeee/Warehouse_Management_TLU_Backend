import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingBaseEntityToImport1747202094939 implements MigrationInterface {
    name = 'AddingBaseEntityToImport1747202094939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "import_details" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "imports" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "imports" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "imports" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imports" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP COLUMN "created_at"`);
    }

}
