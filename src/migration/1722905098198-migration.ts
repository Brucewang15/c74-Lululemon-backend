import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722905098198 implements MigrationInterface {
    name = 'Migration1722905098198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "email" varchar NOT NULL,
                "age" integer NOT NULL,
                "gender" varchar,
                "password" varchar NOT NULL,
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
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar NOT NULL,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user_entity" (
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
                "age" integer NOT NULL,
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
        await queryRunner.query(`
            DROP TABLE "product_entity"
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
                "age" integer NOT NULL,
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
