import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraint1748511342895 implements MigrationInterface {
    name = 'RemoveUniqueConstraint1748511342895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
    }

}
