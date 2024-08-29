import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723063426704 implements MigrationInterface {
  name = "Migration1723063426704";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password"
            FROM "user_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "user_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_user_entity"
                RENAME TO "user_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar,
                "lastName" varchar,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken"
            FROM "user_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "user_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_user_entity"
                RENAME TO "user_entity"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_entity"
                RENAME TO "temporary_user_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
            INSERT INTO "user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken"
            FROM "temporary_user_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_user_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_entity"
                RENAME TO "temporary_user_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
            INSERT INTO "user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password"
            FROM "temporary_user_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_user_entity"
        `);
  }
}
