import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCustomerConstraintToExport1747128566850 implements MigrationInterface {
    name = 'AddingCustomerConstraintToExport1747128566850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exports" ADD "customer_id" uuid`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_2586c097ac987cd82d5741aeca3" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_2586c097ac987cd82d5741aeca3"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP COLUMN "customer_id"`);
    }

}
