import { MigrationInterface, QueryRunner } from "typeorm";

export class FixWarehouseTransferTenantColumn1749195859034 implements MigrationInterface {
    name = 'FixWarehouseTransferTenantColumn1749195859034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_c0d3a90a2849de2e0777718e508"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_4e17968a943176f0eb4b67df5ed" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_4e17968a943176f0eb4b67df5ed"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_c0d3a90a2849de2e0777718e508" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
