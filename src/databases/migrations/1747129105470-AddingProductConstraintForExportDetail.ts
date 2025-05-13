import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingProductConstraintForExportDetail1747129105470 implements MigrationInterface {
    name = 'AddingProductConstraintForExportDetail1747129105470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_a16536548dd72dda172a389090a" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_a16536548dd72dda172a389090a"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "product_id"`);
    }

}
