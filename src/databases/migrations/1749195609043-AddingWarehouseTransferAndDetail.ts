import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingWarehouseTransferAndDetail1749195609043 implements MigrationInterface {
    name = 'AddingWarehouseTransferAndDetail1749195609043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouse_transfer_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "warehouseTransferId" uuid, "productId" uuid, "tenantId" uuid, CONSTRAINT "PK_a83aa2ac2454becda8c62066d28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse_transfer" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "user_id" uuid, "from_warehouse_id" uuid, "to_warehouse_id" uuid, "tenant_id" uuid, CONSTRAINT "PK_941ddf7509ae1af0786a29efa98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_0a2e3a096503d41e702e2d5ac11" FOREIGN KEY ("warehouseTransferId") REFERENCES "warehouse_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_86a8aa2324b7793e3dbbfdf39c2" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_c0d3a90a2849de2e0777718e508" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" ADD CONSTRAINT "FK_3b5b99c0ebb82a0a0c89572e0ea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" ADD CONSTRAINT "FK_65e0fc80710f2d0678df28edb1e" FOREIGN KEY ("from_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" ADD CONSTRAINT "FK_0c70b6806d629e0876808c402b5" FOREIGN KEY ("to_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" ADD CONSTRAINT "FK_5ced54da730dcd8255158101b00" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" DROP CONSTRAINT "FK_5ced54da730dcd8255158101b00"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" DROP CONSTRAINT "FK_0c70b6806d629e0876808c402b5"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" DROP CONSTRAINT "FK_65e0fc80710f2d0678df28edb1e"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer" DROP CONSTRAINT "FK_3b5b99c0ebb82a0a0c89572e0ea"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_c0d3a90a2849de2e0777718e508"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_86a8aa2324b7793e3dbbfdf39c2"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_0a2e3a096503d41e702e2d5ac11"`);
        await queryRunner.query(`DROP TABLE "warehouse_transfer"`);
        await queryRunner.query(`DROP TABLE "warehouse_transfer_details"`);
    }

}
