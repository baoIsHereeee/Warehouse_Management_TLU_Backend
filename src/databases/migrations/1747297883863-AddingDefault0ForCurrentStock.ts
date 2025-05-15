import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingDefault0ForCurrentStock1747297883863 implements MigrationInterface {
    name = 'AddingDefault0ForCurrentStock1747297883863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "current_stock" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "current_stock" DROP DEFAULT`);
    }

}
