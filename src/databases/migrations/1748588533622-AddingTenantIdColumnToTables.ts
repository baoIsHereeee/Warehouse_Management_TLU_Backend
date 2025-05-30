import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingTenantIdColumnToTables1748588533622 implements MigrationInterface {
    name = 'AddingTenantIdColumnToTables1748588533622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "exports" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "imports" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_c4afd13586b798dae62370f3bcf" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_37c1a605468d156e6a8f78f1dc5" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_5862c84bb024e7af814b242c35c" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_dd5cd678c4e94ddb93a224e7116" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_f2a5a62999fd1174ca6f609e653" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imports" ADD CONSTRAINT "FK_368dc683bb89c208e36a4e2f0d9" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_46a85229c9953b2b94f768190b2" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_6804855ba1a19523ea57e0769b4" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_f64f1aa744ddba1303b0755aacb" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_c747b0a69a22b026c99bac8b100" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_c747b0a69a22b026c99bac8b100"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_f64f1aa744ddba1303b0755aacb"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_6804855ba1a19523ea57e0769b4"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_46a85229c9953b2b94f768190b2"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP CONSTRAINT "FK_368dc683bb89c208e36a4e2f0d9"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_f2a5a62999fd1174ca6f609e653"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_dd5cd678c4e94ddb93a224e7116"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_5862c84bb024e7af814b242c35c"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_37c1a605468d156e6a8f78f1dc5"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_c4afd13586b798dae62370f3bcf"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP COLUMN "tenantId"`);
    }

}
