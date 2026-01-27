import { MigrationInterface, QueryRunner } from "typeorm";

export class NameFieldAddToUserTable1769521005487 implements MigrationInterface {
    name = 'NameFieldAddToUserTable1769521005487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
