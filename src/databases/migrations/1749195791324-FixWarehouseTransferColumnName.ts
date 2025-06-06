import { MigrationInterface, QueryRunner } from "typeorm";

export class FixWarehouseTransferColumnName1749195791324 implements MigrationInterface {
    name = 'FixWarehouseTransferColumnName1749195791324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_86a8aa2324b7793e3dbbfdf39c2"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_0a2e3a096503d41e702e2d5ac11"`);
        await queryRunner.query(`CREATE TABLE "warehouse_transfers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "user_id" uuid, "from_warehouse_id" uuid, "to_warehouse_id" uuid, "tenant_id" uuid, CONSTRAINT "PK_ad7cb2d7e9ae89bbb5f0444e92d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP COLUMN "warehouseTransferId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD "warehouse_transfer_id" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_498d18835da85a4d2f29cfd5ab1" FOREIGN KEY ("warehouse_transfer_id") REFERENCES "warehouse_transfers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_bf3ebde3cb2c2d2b665a06c87cc" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "FK_0c33ef5dee5f74df05dda4dec4d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "FK_21782d2cf3c1fbc4432fc75abc1" FOREIGN KEY ("from_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "FK_78587322256bf95ee864a5b387a" FOREIGN KEY ("to_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "FK_0840e4bec158c6ecc39b2f94764" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" DROP CONSTRAINT "FK_0840e4bec158c6ecc39b2f94764"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" DROP CONSTRAINT "FK_78587322256bf95ee864a5b387a"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" DROP CONSTRAINT "FK_21782d2cf3c1fbc4432fc75abc1"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfers" DROP CONSTRAINT "FK_0c33ef5dee5f74df05dda4dec4d"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_bf3ebde3cb2c2d2b665a06c87cc"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP CONSTRAINT "FK_498d18835da85a4d2f29cfd5ab1"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" DROP COLUMN "warehouse_transfer_id"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD "warehouseTransferId" uuid`);
        await queryRunner.query(`DROP TABLE "warehouse_transfers"`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_0a2e3a096503d41e702e2d5ac11" FOREIGN KEY ("warehouseTransferId") REFERENCES "warehouse_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_transfer_details" ADD CONSTRAINT "FK_86a8aa2324b7793e3dbbfdf39c2" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
