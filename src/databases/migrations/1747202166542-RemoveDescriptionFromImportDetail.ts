import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDescriptionFromImportDetail1747202166542 implements MigrationInterface {
    name = 'RemoveDescriptionFromImportDetail1747202166542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "import_details" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "import_details" ADD "description" text`);
    }

}
