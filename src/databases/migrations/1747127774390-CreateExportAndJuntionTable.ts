import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExportAndJuntionTable1747127774390 implements MigrationInterface {
    name = 'CreateExportAndJuntionTable1747127774390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "userId" uuid, CONSTRAINT "PK_bcf8528d214cbfc68c01f337511" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "export_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "selling_price" numeric(10,2) NOT NULL, "exportRecordId" uuid, "warehouseId" uuid, CONSTRAINT "PK_6486de23a18305a9aaa16f3543f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_cd97426e551b0cad4717f52b10d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_a6021862f9f067487756c54721c" FOREIGN KEY ("exportRecordId") REFERENCES "exports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_details" ADD CONSTRAINT "FK_a6de4a1cd8b9faaabd1a8efa93c" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_a6de4a1cd8b9faaabd1a8efa93c"`);
        await queryRunner.query(`ALTER TABLE "export_details" DROP CONSTRAINT "FK_a6021862f9f067487756c54721c"`);
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_cd97426e551b0cad4717f52b10d"`);
        await queryRunner.query(`DROP TABLE "export_details"`);
        await queryRunner.query(`DROP TABLE "exports"`);
    }

}
