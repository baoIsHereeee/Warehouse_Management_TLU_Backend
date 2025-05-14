import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateImportAndJunctionTable1747201969600 implements MigrationInterface {
    name = 'CreateImportAndJunctionTable1747201969600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "import_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "import_record_id" uuid, "product_id" uuid, "warehouse_id" uuid, CONSTRAINT "PK_1e9edc3cb1e42e36a78d2c10add" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "user_id" uuid, "supplier_id" uuid, CONSTRAINT "PK_ea10c62f5eb1d75e83d8b5225db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_f1e0be9d68bd6b176f8da272b6b" FOREIGN KEY ("import_record_id") REFERENCES "imports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_a64172df6420b2b2f6102158ecb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "import_details" ADD CONSTRAINT "FK_b625c2089bc9e1d5a16cbc4b2c5" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imports" ADD CONSTRAINT "FK_03e69994a0b9e3084b4790f8d7b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imports" ADD CONSTRAINT "FK_340af24b76fed8e210aaec464b9" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imports" DROP CONSTRAINT "FK_340af24b76fed8e210aaec464b9"`);
        await queryRunner.query(`ALTER TABLE "imports" DROP CONSTRAINT "FK_03e69994a0b9e3084b4790f8d7b"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_b625c2089bc9e1d5a16cbc4b2c5"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_a64172df6420b2b2f6102158ecb"`);
        await queryRunner.query(`ALTER TABLE "import_details" DROP CONSTRAINT "FK_f1e0be9d68bd6b176f8da272b6b"`);
        await queryRunner.query(`DROP TABLE "imports"`);
        await queryRunner.query(`DROP TABLE "import_details"`);
    }

}
