import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeImportDetailPriceColumn1747212254530 implements MigrationInterface {
    name = 'ChangeImportDetailPriceColumn1747212254530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "import_details" RENAME COLUMN "price" TO "import_price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "import_details" RENAME COLUMN "import_price" TO "price"`);
    }

}
