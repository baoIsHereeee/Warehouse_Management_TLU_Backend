import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExportUserColumnName1747127888698 implements MigrationInterface {
    name = 'ChangeExportUserColumnName1747127888698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_cd97426e551b0cad4717f52b10d"`);
        await queryRunner.query(`ALTER TABLE "exports" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_9436a31587064c89086706f4077" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exports" DROP CONSTRAINT "FK_9436a31587064c89086706f4077"`);
        await queryRunner.query(`ALTER TABLE "exports" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "exports" ADD CONSTRAINT "FK_cd97426e551b0cad4717f52b10d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
