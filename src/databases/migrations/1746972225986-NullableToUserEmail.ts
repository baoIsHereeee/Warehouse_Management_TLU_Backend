import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableToUserEmail1746972225986 implements MigrationInterface {
    name = 'NullableToUserEmail1746972225986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    }

}
