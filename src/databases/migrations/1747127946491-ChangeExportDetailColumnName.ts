import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExportDetailColumnName1747127946491 implements MigrationInterface {
    name = 'ChangeExportDetailColumnName1747127946491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_a6021862f9f067487756c54721c"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_a6de4a1cd8b9faaabd1a8efa93c"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "exportRecordId"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "warehouseId"`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "export_record_id" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_9d54edcbfbd02d6ae7a926c0559" FOREIGN KEY ("export_record_id") REFERENCES "exports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_9035f158c0924ce4da0e72f14b3" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_9035f158c0924ce4da0e72f14b3"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_9d54edcbfbd02d6ae7a926c0559"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "export_record_id"`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "warehouseId" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD "exportRecordId" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_a6de4a1cd8b9faaabd1a8efa93c" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_a6021862f9f067487756c54721c" FOREIGN KEY ("exportRecordId") REFERENCES "exports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
