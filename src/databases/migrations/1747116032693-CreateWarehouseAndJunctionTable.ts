import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWarehouseAndJunctionTable1747116032693 implements MigrationInterface {
    name = 'CreateWarehouseAndJunctionTable1747116032693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouse_details" ("warehouse_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c945d214434ec72d6bb51cf5f64" PRIMARY KEY ("warehouse_id", "product_id"))`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "phone" text, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_1a4b59f9cd7bab410ac35a90eff" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_a6ca1460093c86e228db484e5bc" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_a6ca1460093c86e228db484e5bc"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_1a4b59f9cd7bab410ac35a90eff"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TABLE "warehouse_details"`);
    }

}
