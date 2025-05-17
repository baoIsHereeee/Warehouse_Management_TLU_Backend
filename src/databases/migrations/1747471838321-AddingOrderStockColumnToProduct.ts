import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingOrderStockColumnToProduct1747471838321 implements MigrationInterface {
    name = 'AddingOrderStockColumnToProduct1747471838321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "order_stock" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "order_stock"`);
    }

}
