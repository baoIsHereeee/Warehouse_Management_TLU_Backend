import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingNullableForProductImageAndMinimumStock1747061611219 implements MigrationInterface {
    name = 'AddingNullableForProductImageAndMinimumStock1747061611219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "minimum_stock" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "minimum_stock" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image" SET NOT NULL`);
    }

}
