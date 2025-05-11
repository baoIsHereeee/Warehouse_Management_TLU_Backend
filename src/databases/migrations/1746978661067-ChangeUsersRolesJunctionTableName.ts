import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUsersRolesJunctionTableName1746978661067 implements MigrationInterface {
    name = 'ChangeUsersRolesJunctionTableName1746978661067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" RENAME TO "users_roles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME TO "user_roles"`);
    }

}
