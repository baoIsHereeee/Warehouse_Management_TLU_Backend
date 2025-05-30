import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTenantIdColumnName1748588811002 implements MigrationInterface {
    name = 'ChangeTenantIdColumnName1748588811002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_c4afd13586b798dae62370f3bcf"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_37c1a605468d156e6a8f78f1dc5"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_5862c84bb024e7af814b242c35c"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_dd5cd678c4e94ddb93a224e7116"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_f2a5a62999fd1174ca6f609e653"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP CONSTRAINT "FK_368dc683bb89c208e36a4e2f0d9"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_46a85229c9953b2b94f768190b2"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_6804855ba1a19523ea57e0769b4"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_f64f1aa744ddba1303b0755aacb"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_c747b0a69a22b026c99bac8b100"`);
        await queryRunner.query(`ALTER TABLE "export_details" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "exports" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "suppliers" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "import_details" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "imports" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "warehouses" RENAME COLUMN "tenantId" TO "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_458b3acb4f916c5cfd4e74a0afe" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_97913f35ac2e435a4463fb50a01" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_86228e7647a35320c40a990de96" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_b0d0350059126fa08fddc3c7a46" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_3bda5cfbda8710012ebe2eff619" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imports" ADD CONSTRAINT "FK_5d35cce45075b8f5365104c99b2" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5d4fe23b360b1b9e16a3f41727f" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9c365ebf78f0e8a6d9e4827ea70" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_fc5ec8af65f88718625dd50173a" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_09106b8068aeaf74fa33666df8f" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_09106b8068aeaf74fa33666df8f"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_fc5ec8af65f88718625dd50173a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9c365ebf78f0e8a6d9e4827ea70"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5d4fe23b360b1b9e16a3f41727f"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP CONSTRAINT "FK_5d35cce45075b8f5365104c99b2"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_3bda5cfbda8710012ebe2eff619"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_b0d0350059126fa08fddc3c7a46"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_86228e7647a35320c40a990de96"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_97913f35ac2e435a4463fb50a01"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_458b3acb4f916c5cfd4e74a0afe"`);
        await queryRunner.query(`ALTER TABLE "warehouses" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "imports" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "import_details" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "suppliers" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "exports" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "export_details" RENAME COLUMN "tenant_id" TO "tenantId"`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_c747b0a69a22b026c99bac8b100" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_f64f1aa744ddba1303b0755aacb" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_6804855ba1a19523ea57e0769b4" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_46a85229c9953b2b94f768190b2" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imports" ADD CONSTRAINT "FK_368dc683bb89c208e36a4e2f0d9" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_f2a5a62999fd1174ca6f609e653" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_dd5cd678c4e94ddb93a224e7116" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_5862c84bb024e7af814b242c35c" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_37c1a605468d156e6a8f78f1dc5" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_c4afd13586b798dae62370f3bcf" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
